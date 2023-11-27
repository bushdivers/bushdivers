<?php

namespace App\Http\Controllers\Airports;

use App\Http\Controllers\Controller;
use App\Models\Airport;
use Honeybadger\Support\Arr;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RenameAirportController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $newIcao = $request->newIcao ?? '';

        if (strlen($newIcao) < 2)
            return redirect()->back()->with(['error' => 'You must enter a new ICAO code']);

        if (Airport::where('identifier', $newIcao ?? '')->count() > 0)
            return redirect()->back()->with(['error' => 'ICAO code already exists']);

        $airport = Airport::where('identifier', $request->airport)->first();
        if (!$airport)
            return redirect()->back()->with(['error' => 'Airport not found']);

        if ($airport->is_hub)
            return redirect()->back()->with(['error' => 'Cannot rename a hub airport']);

        try {
            DB::transaction(function () use ($newIcao, $airport) {
                $oldIcao = $airport->identifier;
                $airport->identifier = $newIcao;
                $airport->save();

                DB::update("UPDATE aircraft SET current_airport_id = ? WHERE current_airport_id = ?", [$newIcao, $oldIcao]);
                DB::update("UPDATE contracts SET dep_airport_id = ? WHERE dep_airport_id = ?", [$newIcao, $oldIcao]);
                DB::update("UPDATE contracts SET arr_airport_id = ? WHERE arr_airport_id = ?", [$newIcao, $oldIcao]);
                DB::update("UPDATE contracts SET current_airport_id = ? WHERE current_airport_id = ?", [$newIcao, $oldIcao]);

                DB::update("UPDATE pireps SET departure_airport_id = ? WHERE departure_airport_id = ?", [$newIcao, $oldIcao]);
                DB::updatE("UPDATE pireps SET destination_airport_id = ? WHERE destination_airport_id = ?", [$newIcao, $oldIcao]);

                DB::update("UPDATE users SET current_airport_id = ? WHERE current_airport_id = ?", [$newIcao, $oldIcao]);

            });
        }
        catch (\Exception $e) {
            return redirect()->back()->with(['error' => 'Error renaming airport']);
        }

        return redirect('airports/' . $newIcao)->with(['success' => 'Airport renamed']);



    }
}
