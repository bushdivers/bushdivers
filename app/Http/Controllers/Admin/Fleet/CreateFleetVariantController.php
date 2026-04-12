<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminFleetVariantRequest;
use App\Models\Fleet;
use App\Models\FleetVariant;
use Illuminate\Http\RedirectResponse;

class CreateFleetVariantController extends Controller
{
    public function __invoke(AdminFleetVariantRequest $request, int $id): RedirectResponse
    {
        $fleet = Fleet::findOrFail($id);

        if ($request->is_default) {
            FleetVariant::where('fleet_id', $fleet->id)->update(['is_default' => false]);
        }

        FleetVariant::create([
            'fleet_id' => $fleet->id,
            'name' => $request->name,
            'is_default' => $request->is_default,
            'pax_capacity' => $request->pax_capacity,
            'cargo_capacity' => $request->cargo_capacity,
            'fuel_capacity' => $request->fuel_capacity,
            'range' => $request->range,
            'mtow' => $request->mtow,
            'zfw' => $request->zfw,
            'sim_type' => $request->sim_type ?? [],
        ]);

        return redirect()->route('admin.fleet.edit', $fleet->id)->with(['success' => 'Variant added']);
    }
}
