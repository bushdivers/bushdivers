<?php

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

/*Route::get('/aircraft/{icao}', \App\Http\Controllers\Fleet\GetAvailableAircraftController::class)
    ->name('fleet.available.aircraft');*/
/*Route::get('/flights/distance/{from}/{to}', \App\Http\Controllers\Dispatch\GetFlightDistanceController::class)
    ->name('flights.distance');*/
Route::get('/liveflights', \App\Http\Controllers\Pireps\GetLiveFlightsController::class)
    ->name('flights.live');
Route::get('/whazzup', [\App\Http\Controllers\Pireps\GetLiveFlightsController::class, 'whazzup'])
    ->name('flights.live.whazzup');
Route::get('/resources/categories', \App\Http\Controllers\Admin\Resources\GetCategoriesController::class)
    ->name('resources.categories');
Route::post('/contracts/bid', \App\Http\Controllers\Contracts\BidForContractController::class)
    ->name('contracts.bid');
Route::post('/contracts/share', \App\Http\Controllers\Contracts\ShareContractController::class)->name('contracts.share');
Route::post('/contracts/assign', \App\Http\Controllers\Contracts\AssignContractController::class)
    ->name('contracts.assign');
Route::get('/aircraft/price/{id}', \App\Http\Controllers\MarketPlace\GetAircraftPriceController::class)
    ->name('aircraft.price');
Route::get('/resources', \App\Http\Controllers\Resources\GetResourcesController::class)
    ->name('api.resources');
Route::put('/admin/categories', \App\Http\Controllers\Admin\Resources\EditResourceCategoryController::class)
    ->name('admin.categories.edit');
Route::get('/tracker-version', \App\Http\Controllers\Tracker\GetTrackerVersionController::class)
    ->name('tracker.version');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dispatch', \App\Http\Controllers\Tracker\GetActiveDispatchController::class);
    Route::get('/dispatch/cargo', \App\Http\Controllers\Tracker\GetDispatchCargoController::class);
    Route::post('/log', \App\Http\Controllers\Tracker\AddFlightLogController::class);
    Route::post('/pirep/submit', \App\Http\Controllers\Tracker\SubmitPirepController::class);
    Route::post('/pirep/status', \App\Http\Controllers\Tracker\UpdatePirepStatusController::class);
    Route::get('/pirep/reset', \App\Http\Controllers\Tracker\CancelPirepController::class);
    Route::post('/tracker/distance', \App\Http\Controllers\Tracker\CheckDistanceController::class);
    Route::post('/pirep/destination', \App\Http\Controllers\Tracker\SetDestinationController::class);
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/jumpseat/cost/{from}/{to}', \App\Http\Controllers\Airports\GetJumpseatCostController::class)
        ->name('jumpseat.cost');
    Route::get('/airport/search/{search}', \App\Http\Controllers\Airports\GetAirportFromSearchController::class)
        ->name('airport.search');

    Route::post('/contracts/split', \App\Http\Controllers\Contracts\SplitContractController::class)->name('contracts.split');
});
