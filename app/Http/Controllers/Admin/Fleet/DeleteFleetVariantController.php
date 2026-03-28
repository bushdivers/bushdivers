<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Enums\PirepState;
use App\Models\Fleet;
use App\Models\FleetVariant;
use App\Models\Pirep;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DeleteFleetVariantController extends Controller
{
    public function __invoke(Request $request, int $id, int $variantId): RedirectResponse
    {
        $fleet = Fleet::findOrFail($id);
        $variant = FleetVariant::where('fleet_id', $fleet->id)->findOrFail($variantId);

        if ($variant->is_default) {
            return redirect()
                ->back()
                ->with(['error' => 'Cannot delete the default variant for this fleet']);
        }

        if ($fleet->variants()->count() <= 1) {
            return redirect()
                ->back()
                ->with(['error' => 'Cannot delete the only variant for this fleet']);
        }

        $activeStates = [PirepState::DISPATCH, PirepState::IN_PROGRESS];
        $activePireps = Pirep::where('fleet_variant_id', $variant->id)
            ->whereIn('state', $activeStates)
            ->exists();

        if ($activePireps) {
            return redirect()
                ->back()
                ->with(['error' => 'Cannot delete a variant that is in use by an active dispatch']);
        }

        $variant->delete();

        return redirect()->route('admin.fleet.edit', $fleet->id)->with(['success' => 'Variant deleted']);
    }
}
