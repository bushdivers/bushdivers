<?php

namespace App\Http\Controllers\Admin\Airports;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUpdateAirportRequest;
use App\Models\Airport;
use Illuminate\Http\Request;

class UpdateAirportController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \App\Http\Requests\AdminUpdateAirportRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(AdminUpdateAirportRequest $request, $id)
    {
        $airport = Airport::thirdParty()->findOrFail($id);
        $validated = $request->validatedWithDefaults();

        $airport->update($validated);

        return redirect()->route('admin.airports')
            ->with('success', 'Third-party airport updated successfully.');
    }
}
