<?php

namespace App\Http\Controllers\Admin\Airports;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Illuminate\Http\Request;

class DeleteAirportController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function __invoke(Request $request, $id)
    {
        $airport = Airport::thirdParty()->findOrFail($id);

        $airport->delete();

        return redirect()->route('admin.airports')
            ->with('success', 'Third-party airport deleted successfully.');
    }
}
