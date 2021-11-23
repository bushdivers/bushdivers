<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowStaffController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $staff = Staff::with('user')->orderBy('sort', 'asc')->get();
        return Inertia::render('General/Staff', ['staff' => $staff]);
    }
}
