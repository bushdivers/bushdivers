<?php

namespace App\Http\Controllers\Admin\Airports;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\HandlesBulkUpload;
use App\Models\Airport;
use App\Models\Enums\AirportRunwaySurface;
use App\Services\Airports\CalcDistanceBetweenPoints;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Location\Coordinate;

class BulkUploadAirportsController extends Controller
{
    use HandlesBulkUpload;

    public function __construct(
        protected CalcDistanceBetweenPoints $calcDistanceBetweenPoints
    ) {}

    public function __invoke(Request $request)
    {
        return $this->handleBulkUpload(
            $request,
            fn ($file, $request) => $this->processAirportsFile($file, $request),
            '/admin/airports'
        );
    }

    private function processAirportsFile($file, Request $request): array
    {
        // Shared caches that will persist across all row validations
        $sharedState = (object) [
            'identifierCache' => collect(),
            'coordinateCache' => collect(),
        ];

        return $this->getCsvService()->processFile(
            $file,
            function ($record, $rowNumber, $context) use ($sharedState) {
                // Create validation rules with access to the current record
                $validationRules = [
                    'identifier' => [
                        'required',
                        'string',
                        'max:5',
                        'alpha_num',
                        function ($attribute, $value, $fail) use ($sharedState) {
                            $upperValue = strtoupper($value);

                            // Check if already used in this file
                            if ($sharedState->identifierCache->has($upperValue)) {
                                $fail("The identifier {$upperValue} is used multiple times in this file.");

                                return;
                            }

                            // Check if exists in database
                            if (Airport::where('identifier', $upperValue)->exists()) {
                                $fail("The airport identifier {$upperValue} already exists.");

                                return;
                            }

                            $sharedState->identifierCache->put($upperValue, true);
                        },
                    ],
                    'name' => 'required|string|max:255',
                    'location' => 'required|string|max:255',
                    'country' => 'required|string|max:255',
                    'country_code' => 'required|string|max:2',
                    'lat' => [
                        'required',
                        'numeric',
                        'between:-90,90',
                        function ($attribute, $value, $fail) use ($sharedState, $record) {
                            $lon = $record['lon'] ?? null;
                            if (! $lon) {
                                return;
                            }

                            try {
                                $coordKey = "{$value},{$lon}";
                                $currentCoord = new Coordinate($value, $lon);

                                // Check if coordinates already used in this file
                                if ($sharedState->coordinateCache->has($coordKey)) {
                                    $fail("These coordinates ({$value}, {$lon}) are used multiple times in this file.");

                                    return;
                                }

                                // Check if coordinates are too close to other coordinates in this upload file
                                foreach ($sharedState->coordinateCache as $existingCoord) {
                                    $distance = $this->calcDistanceBetweenPoints->execute($value, $lon, $existingCoord->getLat(), $existingCoord->getLng());
                                    if ($distance < 2) {
                                        $fail("Coordinates ({$value}, {$lon}) are within 2nm of another airport in this upload file at ({$existingCoord->getLat()}, {$existingCoord->getLng()}).");

                                        return;
                                    }
                                }

                                // Check if coordinates are too close to existing airports
                                if ($nearAirport = Airport::whereNull('user_id')->inRangeOf($currentCoord, 0, 2)->first()) {
                                    $fail("ICAO {$nearAirport->identifier} already exists within 2nm of coordinates ({$value}, {$lon}).");

                                    return;
                                }

                                $sharedState->coordinateCache->put($coordKey, $currentCoord);
                            } catch (\Exception $e) {
                                // If coordinate creation fails, let Laravel's between validation handle it
                                return;
                            }
                        },
                    ],
                    'lon' => 'required|numeric|between:-180,180',
                    'magnetic_variance' => 'required|numeric|between:-180,180',
                    'altitude' => 'required|integer|min:-1000|max:30000',
                    'size' => 'required|integer|min:1|max:5',
                    'longest_runway_length' => 'required|integer|min:0|max:20000',
                    'longest_runway_width' => 'required|integer|min:0|max:500',
                    'longest_runway_surface' => [
                        'required',
                        'string',
                        function ($attribute, $value, $fail) {
                            $enumCases = AirportRunwaySurface::cases();
                            $validNames = collect($enumCases)->map(fn ($case) => $case->name)->toArray();

                            $upperValue = strtoupper($value);

                            if (! in_array($upperValue, $validNames)) {
                                $validSurfacesList = implode(', ', $validNames);
                                $fail("The runway surface must be one of: {$validSurfacesList}. Got: {$value}");
                            }
                        },
                    ],
                    'has_avgas' => 'required|boolstring',
                    'has_jetfuel' => 'required|boolstring',
                ];

                $validator = Validator::make($record, $validationRules);

                if ($validator->fails()) {
                    return [
                        'success' => false,
                        'errors' => [[
                            'row' => $rowNumber,
                            'message' => implode(', ', $validator->errors()->all()),
                        ]],
                    ];
                }

                try {
                    // Process the validated data
                    $this->createAirport($validator->validated());

                    return ['success' => true];
                } catch (\Exception $e) {
                    return [
                        'success' => false,
                        'errors' => [[
                            'row' => $rowNumber,
                            'message' => $e->getMessage(),
                        ]],
                    ];
                }
            },
            [],
            ['identifier', 'name', 'location', 'country', 'country_code', 'lat', 'lon', 'magnetic_variance', 'altitude', 'size', 'longest_runway_length', 'longest_runway_width', 'longest_runway_surface', 'has_avgas', 'has_jetfuel'] // Required columns
        );
    }

    private function createAirport(array $data): void
    {
        // Convert runway surface name/label to enum value
        $runwaySurfaceValue = $this->convertRunwaySurfaceToValue($data['longest_runway_surface']);

        // Apply defaults and transformations like in AdminCreateAirportRequest
        $airportData = array_merge($data, [
            'is_thirdparty' => true,
            'magnetic_variance' => $data['magnetic_variance'] ?? 0,
            'identifier' => strtoupper($data['identifier']),
            'longest_runway_surface' => $runwaySurfaceValue,
            'has_avgas' => strtolower($data['has_avgas']) == 'true',
            'has_jetfuel' => strtolower($data['has_jetfuel']) == 'true',
        ]);

        // Set flag from existing airport with same country code
        if (! empty($data['country_code'])) {
            $airportData['flag'] = Airport::where('country_code', $data['country_code'])
                ->first()?->flag ?? null;
        }

        Airport::create($airportData);
    }

    private function convertRunwaySurfaceToValue(string $surface): string
    {
        $enumCases = AirportRunwaySurface::cases();
        $upperSurface = strtoupper($surface);

        // Check if it's an enum name (case-insensitive)
        foreach ($enumCases as $case) {
            if ($case->name === $upperSurface) {
                return $case->value;
            }
        }

        // Fallback - return as is (shouldn't happen if validation passed)
        return $surface;
    }
}
