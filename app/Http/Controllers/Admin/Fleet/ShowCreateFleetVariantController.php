<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Fleet;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowCreateFleetVariantController extends Controller
{
    public function __invoke(Request $request, int $id): Response
    {
        $fleet = Fleet::findOrFail($id);

        return Inertia::render('Admin/FleetVariantEdit', [
            'fleet' => $fleet,
            'variant' => null,
        ]);
    }
}
