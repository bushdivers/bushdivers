<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Contracts/Contracts');
    }
}
