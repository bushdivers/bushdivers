<?php

namespace App\Http\Controllers\Admin\Dispatch;

use App\Http\Controllers\Controller;
use App\Models\CargoType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShowCargoTypesController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $cargoTypes = CargoType::all();

        return Inertia::render('Admin/CargoTypes', ['cargoTypes' => $cargoTypes]);
    }
}
