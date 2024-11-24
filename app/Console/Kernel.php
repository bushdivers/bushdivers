<?php

namespace App\Console;

use App\Models\Enums\FinancialConsts;
use App\Services\Airports\ResupplyFuel;
use App\Services\Airports\UpdateFuelAtAirport;
use App\Services\Contracts\CheckForExpiry;
use App\Services\Contracts\CreateCommunityContract;
use App\Services\Contracts\GenerateRecurringCommunityJobs;
use App\Services\Finance\CalcMonthlyFees;
use App\Services\Pireps\FindInactivePireps;
use App\Services\Pireps\RemoveSinglePirep;
use App\Services\Rentals\EndRental;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    protected FindInactivePireps $findInactivePireps;
    protected RemoveSinglePirep $removeSinglePirep;
    protected CalcMonthlyFees $calcMonthlyFees;
    protected CheckForExpiry $checkForExpiry;

    protected ResupplyFuel $resupplyFuel;

    protected GenerateRecurringCommunityJobs $generateRecurringCommunityJobs;

    public function __construct(
        Application $app,
        Dispatcher $events,
        FindInactivePireps $findInactivePireps,
        RemoveSinglePirep $removeSinglePirep,
        CalcMonthlyFees $calcMonthlyFees,
        CheckForExpiry $checkForExpiry,
        ResupplyFuel $resupplyFuel,
        GenerateRecurringCommunityJobs $generateRecurringCommunityJobs
    )
    {
        parent::__construct($app, $events);
        $this->findInactivePireps = $findInactivePireps;
        $this->removeSinglePirep = $removeSinglePirep;
        $this->calcMonthlyFees = $calcMonthlyFees;
        $this->checkForExpiry = $checkForExpiry;
        $this->resupplyFuel = $resupplyFuel;
        $this->generateRecurringCommunityJobs = $generateRecurringCommunityJobs;
    }

    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
         //removed inactive pireps to clear up booked planes
        $schedule->call(function () {
            $inactivePireps = $this->findInactivePireps->execute();
            foreach ($inactivePireps as $inactivePirep) {
                $this->removeSinglePirep->execute($inactivePirep);
            }
            Log::info('Pirep tidy up was called');
        })->hourly();

        $schedule->call(function () {
            $this->checkForExpiry->execute();
            Log::info('Contract expiry was called');
        })->twiceDaily();

        // financial calculations
        $schedule->call(function () {
            $this->calcMonthlyFees->execute();
            Log::info('Monthly financials was called');
        })->monthly();

        $schedule->call(function () {
            $this->resupplyFuel->execute(true);
        })->daily();

        $schedule->call(function () {
            $this->resupplyFuel->execute();
        })->weekly();

        $schedule->call(function () {
            $this->generateRecurringCommunityJobs->execute();
        })->daily();

        $schedule->command('auth:clear-resets')->hourly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
