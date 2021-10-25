<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileRequest;
use App\Models\Airport;
use App\Models\Enums\PirepState;
use App\Models\Enums\TransactionTypes;
use App\Models\Pirep;
use App\Models\Rank;
use App\Models\User;
use App\Services\AirportService;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class CrewController extends Controller
{
    protected UserService $userService;
    protected AirportService $airportService;

    public function __construct(UserService $userService, AirportService $airportService)
    {
        $this->userService = $userService;
        $this->airportService = $airportService;
    }

    public function intro(): Response
    {
        return Inertia::render('Crew/Intro');
    }

    public function index(): Response
    {
        $user = User::find(Auth::user()->id);
        $lastFlight = Pirep::with('aircraft', 'aircraft.fleet', 'depAirport', 'arrAirport')
            ->where('user_id', $user->id)
            ->where('state', PirepState::ACCEPTED)
            ->orderBy('submitted_at', 'desc')
            ->first();

        $rank = Rank::find($user->rank_id);
        $nextRank = Rank::find($user->rank_id + 1);

        $locations = DB::table('airports')
            ->join('pireps', 'airports.identifier', '=', 'pireps.destination_airport_id')
            ->select('airports.identifier', 'airports.name', 'airports.lon', 'airports.lat')
            ->where('pireps.user_id', Auth::user()->id)
            ->distinct()
            ->get();

        $balance = DB::table('user_accounts')
            ->where('user_id', Auth::user()->id)
            ->sum('total');

        return Inertia::render('Crew/Dashboard', [
            'user' => $user,
            'lastFlight' => $lastFlight,
            'rank' => $rank,
            'nextRank' => $nextRank,
            'awards' => $user->awards,
            'locations' => $locations,
            'balance' => $balance
        ]);
    }

    public function roster(): Response
    {
        $users = User::with('rank', 'location')
            ->where('is_active', true)
            ->get();

        return Inertia::render('Crew/Roster', ['roster' => $users]);
    }

    public function profile(): Response
    {
        $user = User::find(Auth::user()->id);

        return Inertia::render('Crew/Profile', ['profile' => $user]);
    }

    public function updateProfile(ProfileRequest $request): RedirectResponse
    {
        $user = User::find(Auth::user()->id);
        if ($user->email != $request->email) {
            if (User::where('email', $request->email)->count() > 0) {
                return redirect()->back()->with(['error' => 'This email is already taken']);
            }
            $user->email = $request->email;
        }

        $user->name = $request->name;
        $user->msfs_username = $request->msfs_username;
        $user->volanta_username = $request->volanta_username;
        $user->discord_username = $request->discord_username;
        $user->opt_in = $request->opt_in;
        if (isset($request->password)) {
            if (strlen($request->password) < 6) {
                return redirect()->back()->with(['error' => 'Password must be 6 or more characters']);
            }
            $user->password = Hash::make($request->password);
        }
        $user->save();

        return redirect()->back()->with(['success' => 'Profile updated']);
    }

    public function finances(): Response
    {
        $accounts = DB::table('user_accounts')->where('user_id', Auth::user()->id)->orderBy('created_at', 'desc')->get();
        $balance = $accounts->sum('total');

        return Inertia::render('Crew/MyFinances', ['accounts' => $accounts, 'balance' => $balance]);
    }

    public function jumpseat(): Response
    {
        $user = User::with('location')->find(Auth::user()->id);
        $spent = DB::table('user_accounts')
            ->where('user_id', Auth::user()->id)
            ->where('type', TransactionTypes::Jumpseat)
            ->sum('total');

        $balance = DB::table('user_accounts')
            ->where('user_id', Auth::user()->id)
            ->sum('total');

        return Inertia::render('Crew/Jumpseat', ['user' => $user, 'spent' => abs($spent), 'balance' => $balance]);
    }

    public function processJumpseat(Request $request): RedirectResponse
    {
        $transactionValue = $request->cost;

        $this->userService->updatePilotLocation($request->icao, Auth::user()->id);
//        $this->userService->updateUserAccountBalance(Auth::user()->id, -$transactionValue);
        $this->userService->addUserAccountEntry(Auth::user()->id, TransactionTypes::Jumpseat, -$transactionValue);

        return redirect()->back()->with(['success' => 'Relocated successfully to '.$request->icao.' at a cost of $'.$request->cost]);
    }
}
