<?php

namespace App\Http\Controllers\General;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ReportWebErrorController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $user = Auth::user()->pilot_id ?? 'unknown user';
        $stack = $request->post('stack');
        if (is_array($stack)) {
            $stack = array_slice($stack, 0, 5);
            $stack = implode("\n", $stack);
        }

        Log::critical('BD website error for ' . $user, [
            'message' => $request->post('message'),
            'url' => $request->post('url', 'unknown url'),
            'detail' => $stack,
        ]);

        abort(500, 'A website error occurred');
    }
}
