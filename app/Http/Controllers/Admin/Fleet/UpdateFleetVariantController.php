<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminFleetVariantRequest;
use App\Models\Fleet;
use App\Models\FleetVariant;
use Illuminate\Http\RedirectResponse;

class UpdateFleetVariantController extends Controller
{
    public function __invoke(AdminFleetVariantRequest $request, int $id, int $variantId): RedirectResponse
    {
        $fleet = Fleet::findOrFail($id);
        $variant = FleetVariant::where('fleet_id', $fleet->id)->findOrFail($variantId);

        if ($request->is_default) {
            FleetVariant::where('fleet_id', $fleet->id)
                ->where('id', '!=', $variant->id)
                ->update(['is_default' => false]);
        } elseif ($variant->is_default) {
            return redirect()
                ->back()
                ->with(['error' => 'Cannot unset default on a variant without selecting another default']);
        }

        $variant->name = $request->name;
        $variant->is_default = $request->is_default;
        $variant->pax_capacity = $request->pax_capacity;
        $variant->cargo_capacity = $request->cargo_capacity;
        $variant->fuel_capacity = $request->fuel_capacity;
        $variant->range = $request->range;
        $variant->mtow = $request->mtow;
        $variant->zfw = $request->zfw;
        $variant->sim_type = $request->sim_type ?? [];
        $variant->save();

        return redirect()->route('admin.fleet.edit', $fleet->id)->with(['success' => 'Variant updated']);
    }
}
