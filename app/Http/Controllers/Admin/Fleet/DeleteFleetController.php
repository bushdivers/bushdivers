<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Fleet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DeleteFleetController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $id): RedirectResponse
    {
        $fleet = Fleet::withCount('aircraft')->find($id);
        if ($fleet && $fleet->aircraft_count > 0)
            return redirect()->back()->with(['error' => 'Unable to delete fleet previously used.']);

        $fleet->delete();

        return redirect()->back()->with(['success' => 'Fleet removed']);
    }
}
