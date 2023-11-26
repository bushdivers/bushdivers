<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Enums\AircraftState;
use App\Services\Finance\AddAirlineTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DeleteAircraftController extends Controller
{
    protected $addAirlineTransaction;

    public function __construct(AddAirlineTransaction $addAirlineTransaction)
    {
        $this->addAirlineTransaction = $addAirlineTransaction;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $id): RedirectResponse
    {
        $aircraft = Aircraft::find($id);
        if ($aircraft->state != AircraftState::AVAILABLE)
            return redirect()->back()->with(['error' => 'Aircraft is not available']);

        $aircraft->owner_id = null;
        $aircraft->save();

        return redirect()->back()->with(['success' => 'Aircraft sold']);
    }
}
