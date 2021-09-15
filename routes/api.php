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

Route::get('/aircraft/{icao}', [\App\Http\Controllers\FleetController::class, 'getAvailableAircraft'])->name('fleet.available.aircraft');
Route::get('/airport/search/{search}', [\App\Http\Controllers\Api\AirportController::class, 'getAirportFromSearch'])->name('airport.searcg');
Route::get('/jumpseat/cost/{from}/{to}', [\App\Http\Controllers\Api\AirportController::class, 'getCostOfJumpseat'])->name('jumpseat.cost');
Route::get('/flights/distance/{from}/{to}', [\App\Http\Controllers\Api\FlightController::class, 'getDistance'])->name('flights.distance');
Route::get('/liveflights', [\App\Http\Controllers\PirepController::class, 'liveFlights'])->name('flights.live');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/bookings', [\App\Http\Controllers\Api\TrackerController::class, 'getDispatchedBookings']);
    Route::post('/log', [\App\Http\Controllers\Api\TrackerController::class, 'postFlightLog']);
    Route::put('/pirep/submit', [\App\Http\Controllers\Api\TrackerController::class, 'submitPirep']);
    Route::put('/pirep/status', [\App\Http\Controllers\Api\TrackerController::class, 'updatePirepStatus']);
});

