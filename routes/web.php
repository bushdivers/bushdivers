<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Public pages
Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])
    ->name('home');
Route::get('/privacy', function () {
    return \Inertia\Inertia::render('General/Privacy');
});
Route::get('/ranks', [\App\Http\Controllers\PageController::class, 'ranks'])
    ->name('ranks');
Route::get('/hubs', [\App\Http\Controllers\AirportController::class, 'hubs'])
    ->name('hubs');
Route::get('/staff', [\App\Http\Controllers\PageController::class, 'staff'])
    ->name('staff');
Route::get('/supporters', [\App\Http\Controllers\PageController::class, 'supporters'])
    ->name('supporters');
Route::get('/live-flights', [\App\Http\Controllers\PirepController::class, 'flightMap'])
    ->name('flights.map');
// Fleet
Route::get('/fleet', [\App\Http\Controllers\FleetController::class, 'index'])
    ->name('fleet');

// Auth
Route::get('/register', \App\Http\Controllers\Auth\ShowRegisterFormController::class)
    ->name('register.index');
Route::post('/register', \App\Http\Controllers\Auth\RegisterNewUserController::class)
    ->name('register');
Route::get('/login', \App\Http\Controllers\Auth\ShowLoginFormController::class)
    ->name('login.index');
Route::post('/login', \App\Http\Controllers\Auth\AuthenticateUserController::class)
    ->name('login');
Route::get('/password', \App\Http\Controllers\Auth\ShowPasswordRequestController::class)
    ->name('password.request.index');
Route::post('/password', \App\Http\Controllers\Auth\RequestPasswordResetController::class)
    ->name('password.request');
Route::get('/password/reset/{token}', \App\Http\Controllers\Auth\ShowPasswordResetController::class)
    ->name('password.reset.index');
Route::post('/password/reset', \App\Http\Controllers\Auth\ResetPasswordController::class)
    ->name('password.reset');

Route::middleware('auth')->group(function () {
    Route::get('/logout', \App\Http\Controllers\Auth\LogoutUserController::class)
        ->name('logout');
    Route::get('/finances', [\App\Http\Controllers\HomeController::class, 'finances'])
        ->name('company.finances');
    // Crew
    Route::get('/dashboard', [\App\Http\Controllers\CrewController::class, 'index'])
        ->name('dashboard');
    Route::get('/intro', [\App\Http\Controllers\CrewController::class, 'intro'])
        ->name('intro');
    Route::get('/roster', [\App\Http\Controllers\CrewController::class, 'roster'])
        ->name('roster');
    Route::get('/profile', [\App\Http\Controllers\CrewController::class, 'profile'])
        ->name('profile.index');
    Route::put('/profile', [\App\Http\Controllers\CrewController::class, 'updateProfile'])
        ->name('profile.update');
    Route::get('/logbook', [\App\Http\Controllers\PirepController::class, 'logbook'])
        ->name('logbook');
    Route::get('/logbook/{pirep}', [\App\Http\Controllers\PirepController::class, 'logbookDetail'])
        ->name('logbook.detail');
    Route::get('/jumpseat', [\App\Http\Controllers\CrewController::class, 'jumpseat'])
        ->name('jumpseat');
    Route::post('/jumpseat', [\App\Http\Controllers\CrewController::class, 'processJumpseat'])
        ->name('jumpseat.process');
    Route::get('/my-finances', [\App\Http\Controllers\CrewController::class, 'finances'])
        ->name('crew.finances');

    // Airports
    Route::get('/airports/{icao?}', [\App\Http\Controllers\AirportController::class, 'index'])
        ->name('airport');

    // Aircraft/Fleet
    Route::get('/aircraft/{id}', [\App\Http\Controllers\FleetController::class, 'aircraftDetail'])
        ->name('aircraft');
    Route::get('/rentals/{icao?}', \App\Http\Controllers\Rentals\ShowRentalAircraftController::class)
        ->name('rentals');
    Route::post('/rentals', \App\Http\Controllers\Rentals\RentAircraftController::class)
        ->name('rentals.rent');


    // Flights
    Route::get('/my-contracts', [\App\Http\Controllers\ContractsController::class, 'myContracts'])
        ->name('bids');
    Route::get('/completed-contracts', [\App\Http\Controllers\ContractsController::class, 'completedContracts'])
        ->name('contracts.completed');
    Route::get('/dispatch', [\App\Http\Controllers\DispatchController::class, 'index'])
        ->name('dispatch');
    Route::post('/dispatch', [\App\Http\Controllers\DispatchController::class, 'create'])
        ->name('dispatch.create');
    Route::post('/dispatch/cancel', [\App\Http\Controllers\DispatchController::class, 'cancel'])
        ->name('dispatch.cancel');
    Route::get('/contracts', [\App\Http\Controllers\ContractsController::class, 'index'])
        ->name('contracts');
    Route::post('/contracts', [\App\Http\Controllers\ContractsController::class, 'getContracts'])
        ->name('contracts.search');
    Route::post('/contracts/bid', [\App\Http\Controllers\ContractsController::class, 'bidForContract'])
        ->name('contracts.bid');
    Route::post('/contracts/cancel', [\App\Http\Controllers\ContractsController::class, 'cancelContract'])
        ->name('contracts.cancel');

    Route::middleware('admin')->group(function () {
        Route::get('/admin/pireps', [App\Http\Controllers\Admin\PirepController::class, 'index'])
            ->name('admin.pireps');
        Route::get('/admin/users', [App\Http\Controllers\Admin\UserController::class, 'index'])
            ->name('admin.users');
        Route::get('/admin/users/admin/{userId}', [App\Http\Controllers\Admin\UserController::class, 'setAdmin'])
            ->name('admin.users.admin');
        Route::get('/admin/users/active/{userId}', [App\Http\Controllers\Admin\UserController::class, 'setStatus'])
            ->name('admin.users.active');
        Route::get('/admin/fleet', [App\Http\Controllers\Admin\FleetController::class, 'index'])
            ->name('admin.fleet');
        Route::get('/admin/fleet/create', [App\Http\Controllers\Admin\FleetController::class, 'create'])
            ->name('admin.fleet.create');
        Route::post('/admin/fleet/create', [App\Http\Controllers\Admin\FleetController::class, 'store'])
            ->name('admin.flee.store');
        Route::get('/admin/fleet/edit/{id}', [App\Http\Controllers\Admin\FleetController::class, 'edit'])
            ->name('admin.fleet.edit');
        Route::post('/admin/fleet/edit/{id}', [App\Http\Controllers\Admin\FleetController::class, 'update'])
            ->name('admin.fleet.update');
        Route::get('/admin/fleet/delete/{id}', [App\Http\Controllers\Admin\FleetController::class, 'delete'])
            ->name('admin.fleet.delete');
        Route::get('/admin/aircraft/create', [App\Http\Controllers\Admin\FleetController::class, 'addAircraft'])
            ->name('admin.aircraft.add');
        Route::post('/admin/aircraft/create', [App\Http\Controllers\Admin\FleetController::class, 'storeAircraft'])
            ->name('admin.aircraft.store');
        Route::get('/admin/aircraft/delete/{id}', [App\Http\Controllers\Admin\FleetController::class, 'deleteAircraft'])
            ->name('admin.aircraft.delete');
    });
});
