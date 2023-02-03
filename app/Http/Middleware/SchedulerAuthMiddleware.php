<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SchedulerAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $token = config('auth.scheduler_token');
        if ($request->header('X-TOKEN') != $token) {
            abort(401);
        }
        return $next($request);
    }
}
