<?php

namespace App\Http\Controllers\MarketPlace;

use App\Http\Controllers\Controller;
use App\Models\Enums\AircraftType;
use App\Models\Fleet;
use App\Models\Manufacturer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowMarketPlaceController extends Controller
{
    public function __invoke(Request $request, $buyer): Response
    {
        $query = Fleet::with(['manufacturer', 'defaultVariant'])
            ->whereHas('variants');

        if ($buyer === 'admin') {
            $query->where('company_fleet', true);
        } else {
            $query->where(
                fn ($q) =>
                $q->where('used_low_price', '>', 0)
                ->orWhere('new_price', '>', 0)
            );
        }

        $fleet = $query->orderBy('name')->get();
        $manufacturers = Manufacturer::orderBy('name')->get();

        return Inertia::render('Marketplace/Index', [
            'fleet' => $fleet,
            'manufacturers' => $manufacturers,
            'buyer' => $buyer,
            'aircraftTypes' => collect(AircraftType::cases())
                ->map(fn ($c) => ['value' => $c->value, 'label' => $c->label()])
                ->values()
                ->all(),
        ]);
    }
}
