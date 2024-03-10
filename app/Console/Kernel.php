<?php

namespace App\Console;

use App\Models\Enums\FinancialConsts;
use App\Services\Airports\ResupplyFuel;
use App\Services\Airports\UpdateFuelAtAirport;
use App\Services\Contracts\CheckForExpiry;
use App\Services\Finance\CalcMonthlyFees;
use App\Services\Pireps\FindInactivePireps;
use App\Services\Pireps\RemoveMultiplePireps;
use App\Services\Rentals\CheckRentalDailyFee;
use App\Services\Rentals\EndRental;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{

    protected CheckRentalDailyFee $checkRentalDailyFee;
    protected FindInactivePireps $findInactivePireps;
    protected RemoveMultiplePireps $removeMultiplePireps;
    protected CalcMonthlyFees $calcMonthlyFees;
    protected CheckForExpiry $checkForExpiry;

    protected ResupplyFuel $resupplyFuel;

    public function __construct(
        Application $app,
        Dispatcher $events,
        CheckRentalDailyFee $checkRentalDailyFee,
        FindInactivePireps $findInactivePireps,
        RemoveMultiplePireps $removeMultiplePireps,
        CalcMonthlyFees $calcMonthlyFees,
        CheckForExpiry $checkForExpiry,
        ResupplyFuel $resupplyFuel
    )
    {
        parent::__construct($app, $events);
        $this->checkRentalDailyFee = $checkRentalDailyFee;
        $this->findInactivePireps = $findInactivePireps;
        $this->removeMultiplePireps = $removeMultiplePireps;
        $this->calcMonthlyFees = $calcMonthlyFees;
        $this->checkForExpiry = $checkForExpiry;
        $this->resupplyFuel = $resupplyFuel;
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
            $this->removeMultiplePireps->execute($inactivePireps);
            Log::info('Pirep tidy up was called');
        })->hourly();

        $schedule->call(function () {
            $this->checkForExpiry->execute();
            Log::info('Contract expiry was called');
        })->twiceDaily();

        $schedule->call(function () {
            $this->checkRentalDailyFee->execute();
            Log::info('Rentals was called');
        })->daily();

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
