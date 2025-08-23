<?php

namespace App\Http\Controllers\Admin\Airports;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminCreateAirportRequest;
use App\Models\Airport;
use Illuminate\Http\Request;

class CreateAirportController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \App\Http\Requests\AdminCreateAirportRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(AdminCreateAirportRequest $request)
    {
        $validated = $request->validatedWithDefaults();

        Airport::create($validated);

        return redirect()->route('admin.airports')
            ->with('success', 'Third-party airport created successfully.');
    }
}
