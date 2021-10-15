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
Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/privacy', function () {
   return \Inertia\Inertia::render('General/Privacy');
});
Route::get('/ranks', [\App\Http\Controllers\PageController::class, 'ranks'])->name('ranks');
Route::get('/hubs', [\App\Http\Controllers\AirportController::class, 'hubs'])->name('hubs');
Route::get('/staff', [\App\Http\Controllers\PageController::class, 'staff'])->name('staff');
Route::get('/supporters', [\App\Http\Controllers\PageController::class, 'supporters'])->name('supporters');
Route::get('/live-flights', [\App\Http\Controllers\PirepController::class, 'flightMap'])->name('flights.map');

// Auth
Route::get('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'index'])->name('register.index');
Route::post('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'register'])->name('register');
Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'index'])->name('login.index');
Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'authenticate'])->name('login');
Route::get('/password', [\App\Http\Controllers\Auth\PasswordRequestController::class, 'index'])->name('password.request.index');
Route::post('/password', [\App\Http\Controllers\Auth\PasswordRequestController::class, 'request'])->name('password.request');
Route::get('/password/reset/{token}', [\App\Http\Controllers\Auth\PasswordResetController::class, 'index'])->name('password.reset.index');
Route::post('/password/reset', [\App\Http\Controllers\Auth\PasswordResetController::class, 'reset'])->name('password.reset');

Route::middleware('auth')->group(function () {
    Route::get('/logout', [\App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');
    Route::get('/finances', [\App\Http\Controllers\HomeController::class, 'finances'])->name('company.finances');
    // Crew
    Route::get('/dashboard', [\App\Http\Controllers\CrewController::class, 'index'])->name('dashboard');
    Route::get('/roster', [\App\Http\Controllers\CrewController::class, 'roster'])->name('roster');
    Route::get('/profile', [\App\Http\Controllers\CrewController::class, 'profile'])->name('profile.index');
    Route::put('/profile', [\App\Http\Controllers\CrewController::class, 'updateProfile'])->name('profile.update');
    Route::get('/logbook', [\App\Http\Controllers\PirepController::class, 'logbook'])->name('logbook');
    Route::get('/logbook/{pirep}', [\App\Http\Controllers\PirepController::class, 'logbookDetail'])->name('logbook.detail');
    Route::get('/jumpseat', [\App\Http\Controllers\CrewController::class, 'jumpseat'])->name('jumpseat');
    Route::post('/jumpseat', [\App\Http\Controllers\CrewController::class, 'processJumpseat'])->name('jumpseat.process');
    Route::get('/my-finances', [\App\Http\Controllers\CrewController::class, 'finances'])->name('crew.finances');

    // Airports
    Route::get('/airports/{icao}', [\App\Http\Controllers\AirportController::class, 'index'])->name('airport');

    // Fleet
    Route::get('/fleet', [\App\Http\Controllers\FleetController::class, 'index'])->name('fleet');

    // Flights
    Route::get('/my-contracts', [\App\Http\Controllers\ContractsController::class, 'myContracts'])->name('bids');
    Route::get('/completed-contracts', [\App\Http\Controllers\ContractsController::class, 'completedContracts'])->name('contracts.completed');
    Route::get('/dispatch', [\App\Http\Controllers\DispatchController::class, 'index'])->name('dispatch');
    Route::post('/dispatch', [\App\Http\Controllers\DispatchController::class, 'create'])->name('dispatch.create');
    Route::post('/dispatch/cancel', [\App\Http\Controllers\DispatchController::class, 'cancel'])->name('dispatch.cancel');
//    Route::delete('/bookings/cancel/{id}', [\App\Http\Controllers\BookingController::class, 'delete'])->name('bookings.delete');
//    Route::get('/dispatch/{id}', [\App\Http\Controllers\PirepController::class, 'getDispatch'])->name('dispatch');
//    Route::post('/bookings/dispatch/create', [\App\Http\Controllers\PirepController::class, 'createDispatch'])->name('dispatch.create');
    Route::get('/contracts', [\App\Http\Controllers\ContractsController::class, 'index'])->name('contracts');
    Route::post('/contracts', [\App\Http\Controllers\ContractsController::class, 'getContracts'])->name('contracts.search');
    Route::post('/contracts/bid', [\App\Http\Controllers\ContractsController::class, 'bidForContract'])->name('contracts.bid');
    Route::post('/contracts/cancel', [\App\Http\Controllers\ContractsController::class, 'cancelContract'])->name('contracts.cancel');
});
