<?php

namespace App\Http\Controllers\Admin\Airports;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminEditBaseAirportRequest;
use App\Models\Aircraft;
use App\Models\Airport;
use App\Models\Enums\PirepState;
use App\Models\Pirep;
use App\Models\Rental;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EditBaseAirportController extends Controller
{
    public function __invoke(AdminEditBaseAirportRequest $request): RedirectResponse
    {
        $airport = Airport::query()->where('identifier', $request->validated('icao'))->firstOrFail();
        $closed = $request->validated('closed');

        if ($closed == $airport->closed) {
            return back()->with('error', 'Airport already ' . ($closed ? 'closed' : 'open'));
        }
        if ($closed && User::query()->where('current_airport_id', $airport->id)->exists()) {
            return back()->with('error', 'Cannot close airport with users currently based there');
        }
        if ($closed && Pirep::query()->where('arrival_airport_id', $airport->id)->whereIn('state', [PirepState::DISPATCH, PirepState::IN_PROGRESS])->exists()) {
            return back()->with('error', 'Cannot close airport with pending PIREPs');
        }

        if ($airport->closed) {
            if (Str::startsWith($airport->identifier, '[X]-')) {
                $airport->identifier = substr($airport->identifier, 4);
            }
            else if (Str::startsWith($airport->identifier, '[X]')) {
                $airport->identifier = substr($airport->identifier, 3);
            }
            $airport->forceFill(['closed' => false])->save();

            return back()->with('success', "{$airport->identifier} reopened");
        }

        // else, we're closing
        $targetId = $request->validated('reassign_to');

        if ($targetId === null || (int)$targetId === 0) {
            return back()->withErrors(['reassign_to' => 'Select an airport to move aircraft to']);
        }

        if ((int) $targetId === $airport->id) {
            return back()->withErrors(['reassign_to' => 'Cannot reassign to the airport being closed']);
        }


        DB::transaction(function () use ($airport, $targetId) {
            if ($targetId !== null) {
                Aircraft::query()->where('current_airport_id', $airport->id)->update(['current_airport_id' => $targetId]);
                Aircraft::query()->where('hub_id', $airport->id)->update(['hub_id' => $targetId]);
                Rental::query()->where('current_airport_id', $airport->id)->update(['current_airport_id' => $targetId]);
            }

            if (Str::startsWith($airport->identifier, '[X]') === false) {
                $airport->forceFill(['identifier' => '[X]' . $airport->identifier])->save();
            }

            $airport->forceFill(['closed' => true])->save();
        });

        return back()->with('success', "{$airport->identifier} closed");
    }
}
