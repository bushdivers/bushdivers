<?php

namespace App\Http\Controllers\Admin\Missions;

use App\Http\Controllers\Controller;
use App\Models\Aircraft;
use App\Models\Enums\PirepState;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UpdateFerryController extends Controller
{
    public function __invoke(Request $request, Aircraft $aircraft)
    {
        // Check if aircraft has an active pirep
        $activePirep = $aircraft->pireps()
            ->where(function ($q) {
                $q->where('state', PirepState::DISPATCH)
                    ->orWhere('state', PirepState::IN_PROGRESS);
            })
            ->first();

        if ($activePirep) {
            throw ValidationException::withMessages([
                'aircraft' => 'Cannot modify ferry status while an active PIREP exists for this aircraft.'
            ]);
        }

        $validated = $request->validate([
            'is_ferry' => 'required|boolean',
            'ferry_user_id' => 'nullable|integer|exists:users,id'
        ]);

        $aircraft->is_ferry = $validated['is_ferry'];
        $aircraft->ferry_user_id = $validated['is_ferry'] ? $validated['ferry_user_id'] : null;
        $aircraft->save();

        return back();
    }
}
