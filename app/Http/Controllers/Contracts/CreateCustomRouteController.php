<?php

namespace App\Http\Controllers\Contracts;

use App\Http\Requests\CustomRouteRequest;
use App\Models\Contract;
use App\Services\Contracts\CreateCustomRoute;
use Illuminate\Database\Eloquent\ModelNotFoundException;
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
        $existingCustom = Contract::where('user_id', Auth::user()->id)
            ->where('is_completed', false)
            ->count();

        if ($existingCustom > 0) {
            return redirect()->back()->with(['error' => 'You already have an outstanding custom contract']);
        }

        try {
            $this->createCustomRoute->execute(strtoupper($request->departure), strtoupper($request->arrival), Auth::user()->id);

            return redirect()->back()->with(['success' => 'Custom route created and added to "My Contracts"']);
        } catch (ModelNotFoundException $exception) {
            return redirect()->back()->with(['error' => 'Airport not found']);
        }

    }
}
