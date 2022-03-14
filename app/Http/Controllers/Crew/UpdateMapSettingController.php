<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UpdateMapSettingController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $user = User::find(Auth::user()->id);
        $user->map_style = $request->map_style;
        $user->save();

        return redirect()->back()->with(['success' => 'Map style updated']);
    }
}
