<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Requests\CustomRouteRequest;
use App\Services\Contracts\CreateCustomRoute;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class CreateCustomRouteController extends Controller
{
    protected CreateCustomRoute $createCustomRoute;

    public function __construct(CreateCustomRoute $createCustomRoute)
    {
        $this->createCustomRoute = $createCustomRoute;
    }

    /**
     * Handle the incoming request.
     *
     * @param  CustomRouteRequest  $request
     * @return RedirectResponse
     */
    public function __invoke(CustomRouteRequest $request): RedirectResponse
    {
        $this->createCustomRoute->execute($request->departure, $request->arrival, Auth::user()->id);

        return redirect()->back()->with(['success' => 'Custom route created and added to "My Contracts"']);
    }
}
