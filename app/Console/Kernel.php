<?php

namespace App\Console;

use App\Services\Contracts\FindAirportsInNeedOfContracts;
use App\Services\Contracts\FindHubsInNeedOfContracts;
use App\Services\Contracts\RemoveStaleContracts;
use App\Services\Finance\CalcMonthlyFees;
use App\Services\Pireps\FindInactivePireps;
use App\Services\Pireps\RemoveMultiplePireps;
use App\Services\Rentals\CheckRentalDailyFee;
use App\Services\Rentals\EndRental;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{

    protected CheckRentalDailyFee $checkRentalDailyFee;
    protected FindInactivePireps $findInactivePireps;
    protected RemoveMultiplePireps $removeMultiplePireps;
    protected FindAirportsInNeedOfContracts $findAirportsInNeedOfContracts;
    protected FindHubsInNeedOfContracts $findHubsInNeedOfContracts;
    protected CalcMonthlyFees $calcMonthlyFees;
    protected RemoveStaleContracts $removeStaleContracts;

    public function __construct(
        Application $app,
        Dispatcher $events,
        CheckRentalDailyFee $checkRentalDailyFee,
        FindInactivePireps $findInactivePireps,
        RemoveMultiplePireps $removeMultiplePireps,
        FindAirportsInNeedOfContracts $findAirportsInNeedOfContracts,
        FindHubsInNeedOfContracts $findHubsInNeedOfContracts,
        CalcMonthlyFees $calcMonthlyFees,
        RemoveStaleContracts $removeStaleContracts
    )
    {
        parent::__construct($app, $events);
        $this->checkRentalDailyFee = $checkRentalDailyFee;
        $this->findInactivePireps = $findInactivePireps;
        $this->removeMultiplePireps = $removeMultiplePireps;
        $this->findAirportsInNeedOfContracts = $findAirportsInNeedOfContracts;
        $this->findHubsInNeedOfContracts = $findHubsInNeedOfContracts;
        $this->calcMonthlyFees = $calcMonthlyFees;
        $this->removeStaleContracts = $removeStaleContracts;
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
        // removed inactive pireps to clear up booked planes
        $schedule->call(function () {
            $inactivePireps = $this->findInactivePireps->execute();
            $this->removeMultiplePireps->execute($inactivePireps);
        })->hourly();

        // contract generation
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute();
        })->daily();

        // contract generation - hubs
        $schedule->call(function () {
            $this->findHubsInNeedOfContracts->execute();
        })->daily();

        $schedule->call(function () {
            $this->checkRentalDailyFee->execute();
        })->daily();

        // financial calculations
        $schedule->call(function () {
            $this->calcMonthlyFees->execute();
        })->monthly();

        // remove stale contracts
        $schedule->call(function () {
            $this->removeStaleContracts->execute();
        })->weekly();
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
