<?php

namespace App\Http\Middleware;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'flash.success' => fn () => $request->session()->get('success'),
            'flash.error' => fn () => $request->session()->get('error'),
            'auth.user' => fn () => $request->user()
                ? $request->user()->only('map_style', 'id', 'name', 'email', 'private_name', 'pilot_id', 'current_bids', 'current_airport_id', 'points', 'is_admin', 'user_roles', 'rank', 'balance')
                : null
        ]);
    }
}
