<?php

namespace App\Http\Controllers\Admin\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Pirep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShowDashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): Response
    {
        $days = intval($request->get('days', 7));
        if ($days == 0)
            $days = 7;

        $stats = Pirep::whereRaw('block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->selectRaw('count(*) as flights')
            ->selectRaw('count(distinct pireps.user_id) as pilots')
            ->selectRaw('0 as airports')
            ->selectRaw('count(distinct aircraft_id) as aircraft')
            ->selectRaw('count(distinct aircraft.id) as fleet')
            ->leftJoin('aircraft', function ($q) {
                $q->on('pireps.aircraft_id', '=', 'aircraft.id');
                $q->where('pireps.is_rental', false);
                $q->where('aircraft.owner_id', 0);
            })
            ->first();

        // Unique airport count is distinct result of unioned two columns
        $ap = DB::select(
                'select count(distinct airport_id) as total_airports from (
                                select departure_airport_id AS airport_id from pireps
                                 where block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
                          union select destination_airport_id AS airport_id from pireps where block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
                        ) as airports', [$days, $days]);

        $stats['airports'] = $ap[0]->total_airports;

        // Get the top pilots by flights
        $pilots = Pirep::whereRaw('block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->selectRaw('user_id as id, count(*) as num')
            ->groupBy('user_id')
            ->orderBy('num', 'desc')
            ->limit(10)
            ->get();

        // Get top pilots by hours
        $pilots_hours = Pirep::whereRaw('block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->selectRaw('user_id as id, sum(flight_time) / 60.0 as num')
            ->groupBy('user_id')
            ->orderBy('num', 'desc')
            ->limit(10)
            ->get();

        // Get top departure airports
        $departuresIcao = DB::table('pireps')
            ->selectRaw('airports.identifier as id, count(*) as num, flag')
            ->join('airports', 'departure_airport_id', '=', 'airports.identifier')
            ->whereRaw('block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->groupBy('airports.identifier', 'flag')
            ->orderBy('num', 'desc')
            ->limit(10)
            ->get();

        // Get top arrival airports
        $arrivalsIcao = DB::table('pireps')
            ->selectRaw('airports.identifier as id, count(*) as num, flag')
            ->join('airports', 'destination_airport_id', '=', 'airports.identifier')
            ->whereRaw('block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->groupBy('airports.identifier', 'flag')
            ->orderBy('num', 'desc')
            ->limit(10)
            ->get();

        // Get top departure airports
        $departures = DB::table('pireps')
            ->selectRaw('IFNULL(airports.country_code, \'NULL\') as id, airports.country, count(*) as num, flag')
            ->join('airports', 'departure_airport_id', '=', 'airports.identifier')
            ->whereRaw('block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->groupBy('airports.country_code', 'airports.country', 'flag')
            ->orderBy('num', 'desc')
            ->limit(10)
            ->get();

        // Get top arrival airports
        $arrivals = DB::table('pireps')
            ->selectRaw('IFNULL(airports.country_code, \'NULL\') as id, airports.country, count(*) as num, flag')
            ->join('airports', 'destination_airport_id', '=', 'airports.identifier')
            ->whereRaw('block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->groupBy('airports.country_code', 'airports.country', 'flag')
            ->orderBy('num', 'desc')
            ->limit(10)
            ->get();

        // Top aircraft by fleet type
        $types = DB::table('pireps')
            ->selectRaw('fleets.name, fleets.type, fleets.id, count(*) as num')
            ->leftJoin('aircraft', function ($q) {
                $q->on('pireps.aircraft_id', '=', 'aircraft.id');
                $q->where('pireps.is_rental', false);
            })
            ->leftJoin('rentals', function ($q) {
                $q->on('pireps.aircraft_id', '=', 'rentals.id');
                $q->where('pireps.is_rental', true);
            })
            ->join('fleets', function ($q) {
                $q->on(DB::raw('ifnull(rentals.fleet_id, aircraft.fleet_id)'), '=', 'fleets.id');
            })
            ->whereRaw('block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->groupBy('fleets.name', 'fleets.type', 'fleets.id')
            ->orderBy('num', 'desc')
            ->limit(10)
            ->get();

        // Top fleet aircraft
        $fleet = DB::table('pireps')
            ->selectRaw('aircraft.id, fleets.type, fleets.name, aircraft.registration, count(*) as num')
            ->leftJoin('aircraft', function ($q) {
                $q->on('pireps.aircraft_id', '=', 'aircraft.id');
                $q->where('pireps.is_rental', false);
                $q->where('owner_id', 0);
            })
            ->join('fleets', function ($q) {
                $q->on('aircraft.fleet_id', '=', 'fleets.id');
            })
            ->whereRaw('block_on_time >= DATE_SUB(NOW(), INTERVAL ? DAY)', [$days])
            ->groupBy('aircraft.id', 'fleets.type', 'fleets.name', 'aircraft.registration')
            ->orderBy('num', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'days' => $days,
            'pilots' => [
                'hours' => $pilots_hours,
                'flights' => $pilots,
            ],
            'airports' => [
                'departuresIcao' => $departuresIcao,
                'arrivalsIcao' => $arrivalsIcao,
                'departures' => $departures,
                'arrivals' => $arrivals,
            ],
            'aircraft' => [
                'types' => $types,
                'fleet' => $fleet,
            ]

            ]);
    }
}
