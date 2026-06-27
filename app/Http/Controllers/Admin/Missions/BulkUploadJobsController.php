<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Traits\HandlesBulkUpload;
use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Models\Enums\CargoType;
use App\Services\Contracts\CreateCommunityContract;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;

/**
 * @phpstan-import-type CsvResult from \App\Services\CsvBulkUploadService
 * @phpstan-import-type CsvRecord from \App\Services\CsvBulkUploadService
 */
class BulkUploadJobsController extends Controller
{
    use HandlesBulkUpload;

    public function __construct(
        private CreateCommunityContract $contractService
    ) {
    }

    public function __invoke(Request $request, CommunityJob $communityJob): RedirectResponse
    {
        return $this->handleBulkUpload(
            $request,
            fn (UploadedFile $file, Request $request) => $this->processJobsFile($file, $request, $communityJob),
            "/admin/missions/{$communityJob->id}",
            ['inject_immediately' => 'boolean']
        );
    }

    /**
     * @return CsvResult
     */
    private function processJobsFile(UploadedFile $file, Request $request, CommunityJob $communityJob): array
    {
        $injectImmediately = $request->boolean('inject_immediately', false);

        /**
         * Cache for airport lookups to avoid duplicate queries
         * @var \Illuminate\Support\Collection<string, Airport>
         */
        $airportCache = collect();

        $validationRules = [
            'departure_icao' => [
                'required',
                'string',
                function ($attribute, $value, $fail) use (&$airportCache) {
                    if (!$airportCache->has($value)) {
                        $airport = Airport::where('identifier', $value)->first();
                        if (!$airport) {
                            $fail("Invalid departure ICAO: {$value}");
                            return;
                        }
                        $airportCache->put($value, $airport);
                    }
                },
            ],
            'arrival_icao' => [
                'required',
                'string',
                function ($attribute, $value, $fail) use (&$airportCache) {
                    if (!$airportCache->has($value)) {
                        $airport = Airport::where('identifier', $value)->first();
                        if (!$airport) {
                            $fail("Invalid arrival ICAO: {$value}.");
                            return;
                        }
                        $airportCache->put($value, $airport);
                    }
                },
            ],
            'cargo_type' => [
                'required',
                Rule::enum(CargoType::class),
            ],
            'cargo' => 'required|string|max:255',
            'qty' => 'required|integer|min:1',
            'is_recurring' => 'required|boolstring',
        ];

        return $this->processCsvUpload(
            $file,
            ['departure_icao', 'arrival_icao', 'cargo_type', 'cargo', 'qty', 'is_recurring'],
            $validationRules,
            fn ($validatedData) => $this->processJobRow($validatedData, $communityJob, $injectImmediately, $airportCache),
            [
                'cargo_type' => 'The cargo_type field must be either 1 (cargo) or 2 (pax).',
                'is_recurring' => 'The is_recurring field must be true or false.'
            ]
        );
    }

    /**
     * @param CsvRecord $row
     * @param CommunityJob $communityJob
     * @param bool $injectImmediately
     * @param \Illuminate\Support\Collection<string, Airport> $airportCache
     * @return void
     */
    private function processJobRow(array $row, CommunityJob $communityJob, bool $injectImmediately, \Illuminate\Support\Collection $airportCache): void
    {
        // Use cached airport lookups - no additional queries needed!
        $depAirport = $airportCache->get($row['departure_icao']);
        $arrAirport = $airportCache->get($row['arrival_icao']);

        // Create the job contract
        $cargoType = CargoType::from($row['cargo_type']);
        $job = new CommunityJobContract();

        $job->dep_airport_id = $depAirport->id;
        $job->arr_airport_id = $arrAirport->id;
        $job->cargo_type = $cargoType;

        $job->forceFill(match ($cargoType) {
            CargoType::Cargo => [
                 'payload' => (int) $row['qty'],
                 'remaining_payload' => (int) $row['qty'],
            ],
            CargoType::Passenger => [
                'pax' => (int) $row['qty'],
                'remaining_pax' => (int) $row['qty'],
            ],
        });

        $job->cargo = $row['cargo'];
        $job->is_recurring = strtolower($row['is_recurring']) == 'true';
        $job->community_job_id = $communityJob->id;
        $job->save();

        // If mission is published and inject_immediately is checked, inject into contracts
        if ($communityJob->is_published && $injectImmediately) {
            $this->contractService->execute($job);
        }
    }
}
