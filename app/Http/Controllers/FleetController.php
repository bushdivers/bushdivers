<?php

namespace App\Http\Controllers;

use App\Models\Fleet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FleetController extends Controller
{
    public function index(): Response
    {
        $fleet = Fleet::with('aircraft')->orderBy('type')->get();
        return Inertia::render('Fleet/FleetList', ['fleet' => $fleet]);
    }
}
