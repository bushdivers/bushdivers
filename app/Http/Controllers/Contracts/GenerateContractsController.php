<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\Controller;
use App\Services\Contracts\FindAirportsInNeedOfContracts;
use Illuminate\Http\Request;

class GenerateContractsController extends Controller
{
    protected FindAirportsInNeedOfContracts $findAirportsInNeedOfContracts;

    public function __construct(FindAirportsInNeedOfContracts $findAirportsInNeedOfContracts)
    {
        $this->findAirportsInNeedOfContracts = $findAirportsInNeedOfContracts;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $this->findAirportsInNeedOfContracts->execute('CA');
    }
}
