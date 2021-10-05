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
        $schedule->call(function () {
            $pirepService = new PirepService();
            $inactivePireps = $pirepService->findInactivePireps();
            $pirepService->removeMultiplePireps($inactivePireps);
        })->daily();
        $schedule->call(function () {
            $contractService = new ContractService();
            $contractService->findAirportsInNeedOfContracts();
            $contractService->findHubsInNeedOfContracts();
        })->daily();
        $schedule->call(function () {
            $financeService = new FinancialsService();
            $financeService->calcMonthlyFees();
        })->monthly();
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
