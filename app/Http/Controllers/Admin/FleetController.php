<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminAddAircraft;
use App\Http\Requests\AdminAddFleet;
use App\Http\Requests\AdminUpdateFleet;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\AircraftState;
use App\Models\Enums\AircraftStatus;
use App\Models\Fleet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FleetController extends Controller
{
    public function index()
    {
        $fleet = Fleet::with('aircraft')->get();

        return Inertia::render('Admin/FleetList', ['fleet' => $fleet]);
    }

    public function create()
    {
        return Inertia::render('Admin/FleetCreate');
    }

    public function store(AdminAddFleet $request)
    {
        $fleet = new Fleet();
        $fleet->type = $request->type;
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
        $fleet->image_url = '';
        $fleet->size = $request->size;
        $fleet->save();

        return redirect()->route('admin.fleet')->with(['success' => 'Fleet added']);
    }

    public function edit($id)
    {
        $fleet = Fleet::find($id);
        return Inertia::render('Admin/FleetEdit', ['fleet' => $fleet]);
    }

    public function update(AdminUpdateFleet $request, $id)
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
        $fleet->image_url = '';
        $fleet->size = $request->size;
        $fleet->save();

        return redirect()->route('admin.fleet')->with(['success' => 'Fleet updated']);
    }

    public function delete($id)
    {
        $fleet = Fleet::find($id);
        $fleet->delete();

        return redirect()->back()->with(['success' => 'Fleet removed']);
    }

    public function addAircraft()
    {
        $fleet = Fleet::all();
        $hubs = Airport::where('is_hub', true)->orderBy('identifier')->get();
        return Inertia::render('Admin/AircraftCreate', ['fleet' => $fleet, 'hubs' => $hubs]);
    }

    public function storeAircraft(AdminAddAircraft $request)
    {
        $aircraft = new Aircraft();
        $aircraft->fleet_id = $request->fleet;
        $aircraft->current_airport_id = $request->hub;
        $aircraft->registration = $request->registration;
        $aircraft->state = AircraftState::AVAILABLE;
        $aircraft->status = AircraftStatus::ACTIVE;
        $aircraft->save();

        return redirect()->route('admin.fleet')->with(['success' => 'Aircraft created']);
    }

    public function deleteAircraft($id)
    {
        $aircraft = Aircraft::find($id);
        $aircraft->delete();

        return redirect()->back()->with(['success' => 'Aircraft removed']);
    }


}
