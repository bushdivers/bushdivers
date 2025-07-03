<?php

namespace App\Http\Controllers\Contracts\Experimental;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowContractGeneratorController extends Controller
{
    public function __invoke(Request $request): Response
    {
        // get random airport

        // call service to prepare and send request to AI

        // return result
        return Inertia::render('Contract/ContractGenerator');
    }
}
