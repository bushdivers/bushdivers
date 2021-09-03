<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('aircraft/{icao}', [\App\Http\Controllers\FleetController::class, 'getAvailableAircraft'])->name('fleet.available.aircraft');


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/bookings', [\App\Http\Controllers\Api\TrackerController::class, 'getDispatchedBookings']);
    Route::post('/log', [\App\Http\Controllers\Api\TrackerController::class, 'postFlightLog']);
    Route::put('/pirep/submit', [\App\Http\Controllers\Api\TrackerController::class, 'submitPirep']);
    Route::put('/pirep/status', [\App\Http\Controllers\Api\TrackerController::class, 'updatePirepStatus']);
});

