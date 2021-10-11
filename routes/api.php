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
Route::get('/airport/search/{search}', [\App\Http\Controllers\Api\AirportController::class, 'getAirportFromSearch'])->name('airport.search');
Route::get('/jumpseat/cost/{from}/{to}', [\App\Http\Controllers\Api\AirportController::class, 'getCostOfJumpseat'])->name('jumpseat.cost');
Route::get('/flights/distance/{from}/{to}', [\App\Http\Controllers\Api\FlightController::class, 'getDistance'])->name('flights.distance');
Route::get('/liveflights', [\App\Http\Controllers\PirepController::class, 'liveFlights'])->name('flights.live');
Route::post('/cargo/split', [\App\Http\Controllers\Api\ContractsController::class, 'splitCargo'])->name('cargo.split');



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dispatch', [\App\Http\Controllers\Api\TrackerController::class, 'getDispatch']);
    Route::get('/dispatch/cargo', [\App\Http\Controllers\Api\TrackerController::class, 'getDispatchCargo']);
    Route::post('/log', [\App\Http\Controllers\Api\TrackerController::class, 'postFlightLog']);
    Route::post('/pirep/submit', [\App\Http\Controllers\Api\TrackerController::class, 'submitPirep']);
    Route::post('/pirep/status', [\App\Http\Controllers\Api\TrackerController::class, 'updatePirepStatus']);
    Route::get('/pirep/reset', [\App\Http\Controllers\Api\TrackerController::class, 'cancelPirep']);
    Route::post('/tracker/distance', [\App\Http\Controllers\Api\TrackerController::class, 'checkDistance']);
    Route::post('/pirep/destination', [\App\Http\Controllers\Api\TrackerController::class, 'updateDestination']);
    Route::get('/test', [\App\Http\Controllers\Api\ContractsController::class, 'test']);
});

