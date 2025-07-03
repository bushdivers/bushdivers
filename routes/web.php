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
Route::get('/', \App\Http\Controllers\General\ShowHomeController::class)
    ->name('home');
Route::get('/privacy', function () {
    return \Inertia\Inertia::render('General/Privacy');
});

Route::get('/supporters', \App\Http\Controllers\General\ShowSupportersController::class)
    ->name('supporters');

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
Route::get('/password/reset', \App\Http\Controllers\Auth\ShowPasswordResetController::class)
    ->name('password.reset.index');
Route::post('/password/reset', \App\Http\Controllers\Auth\ResetPasswordController::class)
    ->name('password.reset');
Route::post('/error', \App\Http\Controllers\General\ReportWebErrorController::class)
    ->name('error.report');
Route::get('/error', \App\Http\Controllers\General\ShowWebErrorController::class)
    ->name('error');

Route::middleware('auth')->group(function () {
    Route::get('/logout', \App\Http\Controllers\Auth\LogoutUserController::class)
        ->name('logout');
    Route::get('/finances', \App\Http\Controllers\General\ShowFinancesController::class)
        ->name('company.finances');

    Route::get('/live-flights', \App\Http\Controllers\Pireps\ShowLiveFlightsController::class)
        ->name('flights.map');
    Route::get('/ranks', \App\Http\Controllers\General\ShowRanksController::class)
        ->name('ranks');
    Route::get('/staff', \App\Http\Controllers\General\ShowStaffController::class)
        ->name('staff');
    Route::get('/fleet', \App\Http\Controllers\Fleet\ShowFleetController::class)
        ->name('fleet');

    // Crew
    Route::get('/dashboard', \App\Http\Controllers\Crew\ShowDashboardController::class)
        ->name('dashboard');
    Route::any('/roster', \App\Http\Controllers\Crew\ShowPilotRosterController::class)
        ->name('roster');
    Route::get('/profile', \App\Http\Controllers\Crew\ShowProfileController::class)
        ->name('profile.index');
    Route::put('/profile', \App\Http\Controllers\Crew\UpdateProfileController::class)
        ->name('profile.update');
    Route::post('/profile/reset', \App\Http\Controllers\Crew\ResetCareerController::class);
    Route::get('/logbook', \App\Http\Controllers\Pireps\ShowLogbookController::class)
        ->name('logbook');
    Route::get('/logbook/{pirep}', \App\Http\Controllers\Pireps\ShowPirepController::class)
        ->name('logbook.detail');
    Route::get('/jumpseat', \App\Http\Controllers\Crew\ShowJumpseatController::class)
        ->name('jumpseat');
    Route::post('/jumpseat', \App\Http\Controllers\Crew\ProcessJumpseatController::class)
        ->name('jumpseat.process');
    Route::get('/my-finances', \App\Http\Controllers\Crew\ShowUserFinancesController::class)
        ->name('crew.finances');
    Route::post('/loans', \App\Http\Controllers\Loans\ApplyForLoanController::class);

    Route::get('/resources', \App\Http\Controllers\Resources\ShowResourcesController::class)
        ->name('resources');
    Route::post('/resources', \App\Http\Controllers\Resources\AddResourceController::class)
        ->name('resources.add');

    Route::get('/fleet-aircraft', \App\Http\Controllers\Fleet\ShowFleetAircraftController::class)
        ->name('fleet.aircraft');

    // Airports
    Route::get('/airports/{icao?}', \App\Http\Controllers\Airports\ShowAirportController::class)
        ->name('airport');


    Route::middleware('role:airport_manager')->group(function () {
        Route::post('/airports/maintenance/rename', \App\Http\Controllers\Airports\RenameAirportController::class)
        ->name('airport.rename');
    });

    // Tours
    Route::get('/tours', \App\Http\Controllers\Tours\ShowToursController::class)
        ->name('tours');
    Route::get('/tours/{id}', \App\Http\Controllers\Tours\ShowTourController::class)
        ->name('tour.detail');
    Route::post('/tours/{id}/join', \App\Http\Controllers\Tours\JoinTourController::class)
        ->name('tour.join');

    // community
    Route::get('/community', \App\Http\Controllers\Community\ShowCommunityController::class)
        ->name('community');


    // Aircraft/Fleet
    Route::get('/aircraft/{id}', \App\Http\Controllers\Fleet\ShowAircraftController::class)
        ->name('aircraft');
    Route::get('/rentals/{icao?}', \App\Http\Controllers\Rentals\ShowRentalAircraftController::class)
        ->name('rentals');
    Route::post('/rentals', \App\Http\Controllers\Rentals\RentAircraftController::class)
        ->name('rentals.rent');
    Route::post('/rentals/end/{id}', \App\Http\Controllers\Rentals\EndRentalController::class)
        ->name('rentals.end');

    Route::post('/aircraft/maintenance', \App\Http\Controllers\Fleet\PerformMaintenanceController::class)
    ->name('aircraft.maintenance');

    Route::get('/bushdivers-hq', \App\Http\Controllers\GetHqController::class)->name('hq');

    Route::middleware('role:fleet_manager')->group(function () {
        Route::post('/aircraft/maintenance/relocate', \App\Http\Controllers\Fleet\RelocateMaintenanceController::class)
            ->name('aircraft.relocate');
    });

    // marketplace
    Route::get('/marketplace/{buyer}', \App\Http\Controllers\MarketPlace\ShowMarketPlaceController::class)
        ->name('marketplace');
    Route::get('/marketplace/list/{manufacturer}/{buyer}', \App\Http\Controllers\MarketPlace\ShowManufacturerController::class)
        ->name('marketplace.manufacture');
    Route::get('/marketplace/purchase/new/{fleet}/{buyer}', \App\Http\Controllers\MarketPlace\ShowPurchaseNewController::class)
        ->name('marketplace.new');
    Route::get('/marketplace/list/used/{fleet}/{buyer}', \App\Http\Controllers\MarketPlace\ShowUsedAircraftController::class)
        ->name('marketplace.list.used');
    Route::get('/marketplace/purchase/used/{id}/{buyer}', \App\Http\Controllers\MarketPlace\ShowPurchaseUsedController::class)
        ->name('marketplace.used');
    Route::post('/marketplace/purchase/{buyer}', \App\Http\Controllers\MarketPlace\PurchaseController::class)
        ->name('marketplace.purchase');
    Route::get('/my-aircraft', \App\Http\Controllers\Aircraft\ShowMyAircraftController::class)
        ->name('aircraft.mine');
    Route::post('/marketplace/sell/{id}/{seller}', \App\Http\Controllers\MarketPlace\SellAircraftController::class)
        ->name('marketplace.sell');


    // experimental contracts
    Route::get('/contracts/experimental', \App\Http\Controllers\Contracts\Experimental\ShowContractGeneratorController::class)
        ->name('contracts.generator');


    // Flights
    Route::get('/available-contracts', \App\Http\Controllers\Contracts\ShowActiveContractsController::class)
        ->name('bids');
    Route::get('/completed-contracts', \App\Http\Controllers\Contracts\ShowCompletedContractsController::class)
        ->name('contracts.completed');
    Route::get('/dispatch', \App\Http\Controllers\Dispatch\ShowDispatchController::class)
        ->name('dispatch');
    Route::post('/dispatch', \App\Http\Controllers\Dispatch\CreateDispatchController::class)
        ->name('dispatch.create');
    Route::post('/dispatch/cancel', \App\Http\Controllers\Dispatch\CancelDispatchController::class)
        ->name('dispatch.cancel');
//    Route::post('/contracts/bid', \App\Http\Controllers\Contracts\BidForContractController::class)
//        ->name('contracts.bid');
    Route::post('/contracts/custom', \App\Http\Controllers\Contracts\CreateCustomRouteController::class)
        ->name('contracts.custom');
    Route::post('/contracts/fuel', \App\Http\Controllers\Contracts\CreateFuelCargoContractController::class)
        ->name('contracts.fuel');
    Route::get('/pireps/submit', \App\Http\Controllers\Pireps\ShowPirepSubmissionController::class)
        ->name('pireps.submit');
    Route::post('/pireps/submit', \App\Http\Controllers\Pireps\ProcessPirepSubmissionController::class)
        ->name('pireps.process');

    // Temporary tie to fleet_admin until generic 'admin' role exists capturing all subroles
    Route::middleware('role:fleet_admin')->group(function() {
        Route::get('/admin/dashboard', \App\Http\Controllers\Admin\Dashboard\ShowDashboardController::class)
            ->name('admin.dashboard');
    });

    Route::middleware('role:fleet_admin')->group(function() {
        Route::get('/admin/fleet', \App\Http\Controllers\Admin\Fleet\ShowFleetListController::class)
            ->name('admin.fleet');
        Route::get('/admin/fleet/create', \App\Http\Controllers\Admin\Fleet\ShowCreateFleetController::class)
            ->name('admin.fleet.create');
        Route::post('/admin/fleet/create', \App\Http\Controllers\Admin\Fleet\CreateFleetController::class)
            ->name('admin.fleet.store');
        Route::get('/admin/fleet/edit/{id}', \App\Http\Controllers\Admin\Fleet\ShowUpdateFleetController::class)
            ->name('admin.fleet.edit');
        Route::post('/admin/fleet/edit/{id}', \App\Http\Controllers\Admin\Fleet\UpdateFleetController::class)
            ->name('admin.fleet.update');
        Route::get('/admin/fleet/delete/{id}', \App\Http\Controllers\Admin\Fleet\DeleteFleetController::class)
            ->name('admin.fleet.delete');
        Route::get('/admin/aircraft/delete/{id}', \App\Http\Controllers\Admin\Fleet\DeleteAircraftController::class)
            ->name('admin.aircraft.delete');
        Route::post('/admin/fleet/upload', \App\Http\Controllers\Admin\Fleet\FleetUploadController::class)
            ->name('admin.fleet.upload');
    });

    Route::middleware('role:tour_admin')->group(function() {
       Route::get('/admin/tours', \App\Http\Controllers\Admin\Tours\ShowToursController::class)
           ->name('admin.tours');
        Route::post('/admin/tours', \App\Http\Controllers\Admin\Tours\CreateTourController::class)
            ->name('admin.tours.create');
        Route::get('/admin/tours/{id}', \App\Http\Controllers\Admin\Tours\ShowTourDetailController::class)
            ->name('admin.tours.details');
        Route::delete('/admin/tours/{id}', \App\Http\Controllers\Admin\Tours\DeleteTourController::class)
            ->name('admin.tours.delete');
        Route::post('/admin/tours/{id}', \App\Http\Controllers\Admin\Tours\EditTourController::class)
            ->name('admin.tours.edit');
        Route::post('/admin/tours/{id}/publish', \App\Http\Controllers\Admin\Tours\PublishTourController::class)
            ->name('admin.tours.publish');
        Route::post('/admin/tours/{id}/fleet', \App\Http\Controllers\Admin\Tours\AddTourFleetController::class)
            ->name('admin.tours.add.fleet');
        Route::delete('/admin/tours/{tour}/fleet/{fleet}', \App\Http\Controllers\Admin\Tours\RemoveTourFleetController::class)
            ->name('admin.tours.remove.fleet');
        Route::post('/admin/tours/{id}/checkpoint', \App\Http\Controllers\Admin\Tours\AddTourCheckpointController::class)
            ->name('admin.tours.add.checkpoint');
        Route::get('/admin/missions', \App\Http\Controllers\Admin\Missions\ShowMissionsController::class)
            ->name('admin.missions');
        Route::get('/admin/missions/{id}', \App\Http\Controllers\Admin\Missions\MissionDetailsController::class)
            ->name('admin.mission.details');
        Route::post('/admin/missions', \App\Http\Controllers\Admin\Missions\CreateMissionsController::class)
            ->name('admin.mission.create');
        Route::post('/admin/missions/{id}', \App\Http\Controllers\Admin\Missions\SaveMissionController::class)
            ->name('admin.mission.edit');
        Route::delete('/admin/missions/{id}', \App\Http\Controllers\Admin\Missions\DeleteMissionController::class)
            ->name('admin.mission.delete');
        Route::post('/admin/missions/{id}/jobs', \App\Http\Controllers\Admin\Missions\AddJobController::class)
            ->name('admin.mission.add.job');
        Route::delete('/admin/missions/jobs/{id}', \App\Http\Controllers\Admin\Missions\DeleteJobController::class)
            ->name('admin.mission.delete.job');
        Route::post('/admin/missions/{id}/publish', \App\Http\Controllers\Admin\Missions\PublishMissionController::class)
            ->name('admin.mission.publish');
        Route::post('/admin/missions/{id}/complete', \App\Http\Controllers\Admin\Missions\CompleteMissionController::class)
            ->name('admin.mission.complete');
    });

    Route::middleware('admin')->group(function () {
        Route::get('/admin/pireps', \App\Http\Controllers\Admin\Pireps\ShowPirepsListController::class)
            ->name('admin.pireps');
        Route::get('/admin/users', \App\Http\Controllers\Admin\Users\ShowUsersController::class)
            ->name('admin.users');
        Route::get('/admin/users/admin/{userId}', \App\Http\Controllers\Admin\Users\SetAdminController::class)
            ->name('admin.users.admin');
        Route::get('/admin/users/active/{userId}', \App\Http\Controllers\Admin\Users\SetStatusController::class)
            ->name('admin.users.active');
        Route::post('/pireps/approve', \App\Http\Controllers\Pireps\ApprovePirepController::class)
            ->name('pireps.approve');
        Route::get('/admin/resources', \App\Http\Controllers\Admin\Resources\ShowResourcesController::class)
            ->name('admin.resources');
        Route::post('/admin/categories', \App\Http\Controllers\Admin\Resources\AddResourceCategoryController::class)
            ->name('admin.categories.add');
        Route::post('/admin/resources/approve/{id}', \App\Http\Controllers\Admin\Resources\ApproveResourceController::class)
            ->name('admin.resources.approve');
        Route::post('/admin/resources/reject/{id}', \App\Http\Controllers\Admin\Resources\RejectResourceController::class)
            ->name('admin.resources.reject');
        Route::get('/admin/hubs', \App\Http\Controllers\Admin\Hubs\ShowHubsController::class)
            ->name('admin.hubs');
        Route::post('/admin/hubs/create', \App\Http\Controllers\Admin\Hubs\CreateHubController::class)
            ->name('admin.hubs.create');
    });


});
