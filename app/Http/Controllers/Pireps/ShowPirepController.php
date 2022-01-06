<?php

namespace App\Http\Controllers\Pireps;

use App\Http\Controllers\Controller;
use App\Models\AccountLedger;
use App\Models\ContractCargo;
use App\Models\FlightLog;
use App\Models\Pirep;
use App\Models\PirepCargo;
use App\Models\Point;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShowPirepController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $pirep): Response
    {
        $pcheck = Pirep::find($pirep);

        if (Auth::user()->is_admin) {
            if ($pcheck->is_rental) {
                $p = Pirep::with('depAirport', 'arrAirport', 'rental', 'rental.fleet', 'pilot')
                    ->where('id', $pirep)
                    ->first();
            } else {
                $p = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet', 'pilot')
                    ->where('id', $pirep)
                    ->first();
            }
        } else {
            if ($pcheck->is_rental) {
                $p = Pirep::with('depAirport', 'arrAirport', 'rental', 'rental.fleet')
                    ->where('id', $pirep)
                    ->where('user_id', Auth::user()->id)
                    ->first();
            } else {
                $p = Pirep::with('depAirport', 'arrAirport', 'aircraft', 'aircraft.fleet')
                    ->where('id', $pirep)
                    ->where('user_id', Auth::user()->id)
                    ->first();
            }
        }

        $pc = PirepCargo::where('pirep_id', $pirep)->pluck('contract_cargo_id');

        $cargo = ContractCargo::with('contract')
            ->whereIn('id', $pc)
            ->get();
        $points = Point::where('pirep_id', $pirep)->where('points', '>', 0)->get();

        $logs = FlightLog::where('pirep_id', $pirep)->orderBy('created_at')->get();
        //$coords = DB::table('flight_logs')->where('pirep_id', $pirep)->select('lat', 'lon')->orderBy('created_at')->get();

        $companyFinancials = AccountLedger::where('pirep_id', $pirep)->get();

        $pilotFinancials = DB::table('user_accounts')->where('flight_id', $pirep)->get();

        $companyTotal = round($companyFinancials->sum('total'),2);
        $pilotTotal = round($pilotFinancials->sum('total'),2);

        return Inertia::render('Crew/LogbookDetail', [
            'pirep' => $p,
            'points' => $points,
            'logs' => $logs,
            'coords' => $logs->pluck('lat', 'lon'),
            'cargo' => $cargo,
            'companyFinancials' => $companyFinancials,
            'pilotFinancials' => $pilotFinancials,
            'companyTotal' => $companyTotal,
            'pilotTotal' => $pilotTotal
        ]);
    }
}
