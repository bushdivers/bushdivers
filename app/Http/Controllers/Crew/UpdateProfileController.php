<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UpdateProfileController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request): RedirectResponse
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
            $pw = Hash::make($request->password);
            $user->password = $pw;

//            $this->updateAkPassword($pw, $user->email);
        }
        $user->save();

        return redirect()->back()->with(['success' => 'Profile updated']);
    }

//    protected function updateAkPassword($password, $email)
//    {
//        try {
//            DB::connection('mysql_ak')->table('users')->where('email', $email)->update([
//                'password' => $password,
//                'updated_at' => Carbon::now()
//            ]);
//        } catch (\Exception) {
//
//        }
//    }
}
