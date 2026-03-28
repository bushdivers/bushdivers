<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Fleet;
use App\Models\FleetVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowUpdateFleetVariantController extends Controller
{
    public function __invoke(Request $request, int $id, int $variantId): Response
    {
        $fleet = Fleet::findOrFail($id);
        $variant = FleetVariant::where('fleet_id', $fleet->id)->findOrFail($variantId);

        return Inertia::render('Admin/FleetVariantEdit', [
            'fleet' => $fleet,
            'variant' => $variant,
        ]);
    }
}
