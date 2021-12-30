<?php

namespace App\Http\Controllers\Pireps;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ShowPirepSubmissionController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('Pireps/Submission');
    }
}
