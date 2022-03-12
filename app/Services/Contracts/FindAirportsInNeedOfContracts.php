<?php

namespace App\Services\Contracts;

use App\Models\Airport;
use App\Models\Contract;
use App\Models\Enums\ContractConsts;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class FindAirportsInNeedOfContracts
{
    protected GenerateContracts $generateContracts;

    public function __construct(GenerateContracts $generateContracts)
    {
        $this->generateContracts = $generateContracts;
    }

    public function execute($letter)
    {
        // find all airports
        try {
            $airports = Airport::where('identifier', 'like', $letter.'%')->get();

            foreach ($airports as $airport) {
                $currentJobs = Contract::where('dep_airport_id', $airport->identifier)
                    ->where('is_available', true)
                    ->where('expires_at', '>', Carbon::now())
                    ->count();

                $maxJobs = 0;
                switch ($airport->size) {
                    case 0:
                    case 1:
                        $maxJobs = ContractConsts::MAX_QTY_JOBS_SM;
                        break;
                    case 2:
                    case 3:
                        $maxJobs = ContractConsts::MAX_QTY_JOBS_MD;
                        break;
                    case 4:
                    case 5:
                        $maxJobs = ContractConsts::MAX_QTY_JOBS_LG;
                        break;
                }

                if ($currentJobs < $maxJobs) {
                    $numberToGenerate = $maxJobs - $currentJobs;
                    $this->generateContracts->execute($airport, $numberToGenerate);
                }
            }
        }
        catch (\Exception $e) {
            Log::channel('single')->debug($e->getMessage(), ['where' => 'Finding airports for contract generation']);
        }
    }
}
