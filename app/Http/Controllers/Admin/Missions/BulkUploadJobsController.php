<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\HandlesBulkUpload;
use App\Models\Airport;
use App\Models\CommunityJob;
use App\Models\CommunityJobContract;
use App\Services\Contracts\CreateCommunityContract;
use Illuminate\Http\Request;

class BulkUploadJobsController extends Controller
{
    use HandlesBulkUpload;

    public function __construct(
        private CreateCommunityContract $contractService
    ) {}

    public function __invoke(Request $request, $id)
    {
        return $this->handleBulkUpload(
            $request,
            fn($file, $request) => $this->processJobsFile($file, $request, $id),
            "/admin/missions/{$id}",
            ['inject_immediately' => 'boolean']
        );
    }

    private function processJobsFile($file, Request $request, $id): array
    {
        $mission = CommunityJob::findOrFail($id);
        $injectImmediately = $request->boolean('inject_immediately', false);

        // Cache for airport lookups to avoid duplicate queries
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
            'cargo_type' => 'required|in:1,2',
            'cargo' => 'required|string|max:255',
            'qty' => 'required|integer|min:1',
            'is_recurring' => 'required|boolstring',
        ];

        return $this->processCsvUpload(
            $file,
            ['departure_icao', 'arrival_icao', 'cargo_type', 'cargo', 'qty', 'is_recurring'],
            $validationRules,
            fn($validatedData) => $this->processJobRow($validatedData, $mission, $injectImmediately, $airportCache),
            [
                'cargo_type' => 'The cargo_type field must be either 1 (cargo) or 2 (pax).',
                'is_recurring' => 'The is_recurring field must be true or false.'
            ]
        );
    }

    private function processJobRow(array $row, CommunityJob $mission, bool $injectImmediately, $airportCache): void
    {
        // Use cached airport lookups - no additional queries needed!
        $depAirport = $airportCache->get($row['departure_icao']);
        $arrAirport = $airportCache->get($row['arrival_icao']);

        // Create the job contract
        $job = new CommunityJobContract();
        $job->dep_airport_id = $depAirport->id;
        $job->arr_airport_id = $arrAirport->id;
        $job->cargo_type = (int) $row['cargo_type'];
        if ($job->cargo_type == 1) {
            $job->payload = (int) $row['qty'];
            $job->remaining_payload = $job->cargo_type == 1 ? (int) $row['qty'] : null;
        } else {
            $job->pax = (int) $row['qty'];
            $job->remaining_pax = $job->cargo_type == 2 ? (int) $row['qty'] : null;
        }

        $job->cargo = $row['cargo'];
        $job->is_recurring = strtolower($row['is_recurring']) == 'true';
        $job->community_job_id = $mission->id;
        $job->save();

        // If mission is published and inject_immediately is checked, inject into contracts
        if ($mission->is_published && $injectImmediately) {
            $this->contractService->execute($job);
        }
    }
}
