<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminUpdateFleet;
use App\Models\Fleet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UpdateFleetController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(AdminUpdateFleet $request, $id): RedirectResponse
    {
        $fleet = Fleet::find($id);
        $fleet->name = $request->name;
        $fleet->manufacturer = $request->manufacturer;
        $fleet->powerplants = $request->powerplants;
        $fleet->number_of_engines = $request->engines;
        $fleet->crew_required = 1;
        $fleet->cabin_crew_required = 0;
        $fleet->fuel_type = $request->fuel;
        $fleet->zfw = $request->zfw;
        $fleet->mtow = $request->mtow;
        $fleet->cargo_capacity = $request->cargo;
        $fleet->pax_capacity = $request->pax;
        $fleet->fuel_capacity = $request->fuelCapacity;
        $fleet->service_ceiling = $request->ceiling;
        $fleet->range = $request->range;
        $fleet->cruise_speed = $request->cruise;
        $fleet->size = $request->size;
        $fleet->tbo_mins = $request->tbo_mins;

        $fleet->company_fleet = $request->company_fleet;
        $fleet->is_rental = $request->is_rental;
        $fleet->rental_cost = $request->rental_cost;
        $fleet->hq = Str::upper($request->hq);
        $fleet->new_price = $request->new_price;
        $fleet->used_low_price = $request->used_low_price;
        $fleet->used_high_price = $request->used_high_price;
        $fleet->manufacturer_id = $request->manufacturer_id;
        $fleet->can_purchase_new = $request->can_purchase_new;

        $fleet->save();

        return redirect()->route('admin.fleet')->with(['success' => 'Fleet updated']);
    }
}
