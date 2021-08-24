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

// Auth
Route::get('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'index'])->name('register.index');
Route::post('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'register'])->name('register');
Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'index'])->name('login.index');
Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'authenticate'])->name('login');

Route::middleware('auth')->group(function () {
    Route::get('/logout', [\App\Http\Controllers\Auth\LoginController::class, 'logout'])->name('logout');
    // Crew
    Route::get('/dashboard', [\App\Http\Controllers\CrewController::class, 'index'])->name('dashboard');

    // Fleet
    Route::get('/fleet', [\App\Http\Controllers\FleetController::class, 'index'])->name('fleet');

    // Flights
    Route::get('/flights', [\App\Http\Controllers\FlightController::class, 'index'])->name('flights');
    Route::get('/flights/search', [\App\Http\Controllers\FlightController::class, 'search'])->name('flights.search');
    Route::get('/bookings', [\App\Http\Controllers\BookingController::class, 'index'])->name('bookings');
    Route::post('/bookings/create/{flight}', [\App\Http\Controllers\BookingController::class, 'create'])->name('bookings.create');
    Route::delete('/bookings/cancel/{flight}', [\App\Http\Controllers\BookingController::class, 'delete'])->name('bookings.delete');
    Route::get('/dispatch/{id}', [\App\Http\Controllers\PirepController::class, 'getDispatch'])->name('dispatch');
    Route::post('/bookings/dispatch/create', [\App\Http\Controllers\PirepController::class, 'createDispatch'])->name('dispatch.create');
});
