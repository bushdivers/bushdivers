<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CrewController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Crew/Dashboard');
    }
}
