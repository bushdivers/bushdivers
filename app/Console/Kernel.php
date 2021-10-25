<?php

namespace App\Console;

use App\Services\AircraftService;
use App\Services\ContractService;
use App\Services\FinancialsService;
use App\Services\PirepService;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
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
            $pirepService = new PirepService();
            $inactivePireps = $pirepService->findInactivePireps();
            $pirepService->removeMultiplePireps($inactivePireps);
        })->daily();

        // contract generation
        $schedule->call(function () {
            $contractService = new ContractService();
            $contractService->findAirportsInNeedOfContracts();
        })->daily();

        // contract generation - hubs
        $schedule->call(function () {
            $contractService = new ContractService();
            $contractService->findHubsInNeedOfContracts();
        })->daily();

        // financial calculations
        $schedule->call(function () {
            $financeService = new FinancialsService();
            $financeService->calcMonthlyFees();
        })->monthly();

        // remove stale contracts
        $schedule->call(function () {
            $contractService = new ContractService();
            $contractService->removeStaleContracts();
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
