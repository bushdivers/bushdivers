<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DeleteAircraftController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $id): RedirectResponse
    {
        $aircraft = Aircraft::find($id);
        $aircraft->delete();

        return redirect()->back()->with(['success' => 'Aircraft removed']);
    }
}
