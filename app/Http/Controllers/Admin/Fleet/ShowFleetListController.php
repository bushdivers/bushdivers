<?php

namespace App\Http\Controllers\Admin\Fleet;

use App\Http\Controllers\Controller;
use App\Models\Fleet;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowFleetListController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $fleet = Fleet::with(['aircraft' => function ($q) {
            $q->where('owner_id', 0);
        }, 'aircraft.engines', 'aircraft.location'])->get();

        $fleet->each(function ($f) {
            $f->aircraft->each->setRelation('fleet', $f);
        });

        $manufacturers = Manufacturer::withCount('fleet')->orderBy('name')->get();

        return Inertia::render('Admin/FleetList', [
            'fleet' => $fleet,
            'manufacturers' => $manufacturers,
        ]);
    }
}
