<?php

namespace App\Console;

use App\Models\Enums\FinancialConsts;
use App\Services\Contracts\ExpiryContractCheck;
use App\Services\Contracts\FindAirportsInNeedOfContracts;
use App\Services\Contracts\FindHubsInNeedOfContracts;
use App\Services\Contracts\RemoveStaleContracts;
use App\Services\Finance\CalcMonthlyFees;
use App\Services\Finance\CollectFinancePayments;
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
    protected ExpiryContractCheck $expiryContractCheck;
    protected CollectFinancePayments $collectFinancePayments;

    public function __construct(
        Application $app,
        Dispatcher $events,
        CheckRentalDailyFee $checkRentalDailyFee,
        FindInactivePireps $findInactivePireps,
        RemoveMultiplePireps $removeMultiplePireps,
        FindAirportsInNeedOfContracts $findAirportsInNeedOfContracts,
        FindHubsInNeedOfContracts $findHubsInNeedOfContracts,
        CalcMonthlyFees $calcMonthlyFees,
        RemoveStaleContracts $removeStaleContracts,
        ExpiryContractCheck $expiryContractCheck,
        CollectFinancePayments $collectFinancePayments,
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
        $this->expiryContractCheck = $expiryContractCheck;
        $this->collectFinancePayments = $collectFinancePayments;
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

        $schedule->call(function () {
            $this->expiryContractCheck->execute(FinancialConsts::ContractExpiryDaysStr);
        })->twiceDaily();

        $schedule->call(function () {
            $this->expiryContractCheck->execute(FinancialConsts::ContractExpiryDayStr);
        })->everyFourHours();

        $schedule->call(function () {
            $this->expiryContractCheck->execute(FinancialConsts::ContractExpiryHalfStr);
        })->everySixHours();

        $schedule->call(function () {
            $this->expiryContractCheck->execute(FinancialConsts::ContractExpiryHoursStr);
        })->hourly();

        $schedule->call(function () {
            $this->expiryContractCheck->execute(FinancialConsts::ContractExpiryHourStr);
        })->everyThirtyMinutes();

        $schedule->call(function () {
            $this->expiryContractCheck->execute(FinancialConsts::ContractExpiryMinsStr);
        })->everyFifteenMinutes();

        $schedule->call(function () {
            $this->checkRentalDailyFee->execute();
        })->daily();

        // financial calculations
        $schedule->call(function () {
            $this->calcMonthlyFees->execute();
        })->monthly();

        // finance payments
        $schedule->call(function () {
           $this->collectFinancePayments->execute();
        })->monthly();

        // remove stale contracts
        $schedule->call(function () {
            $this->removeStaleContracts->execute();
        })->weekly();

        //contract generation
//        $schedule->call(function () {
//            $this->findAirportsInNeedOfContracts->execute('PG');
//        })->dailyAt('00:15');
//        $schedule->call(function () {
//            $this->findAirportsInNeedOfContracts->execute('US');
//        })->dailyAt('00:30');

        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('A');
        })->daily();
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('B');
        })->dailyAt('00:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('C');
        })->dailyAt('01:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('D');
        })->dailyAt('01:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('E');
        })->dailyAt('02:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('F');
        })->dailyAt('02:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('G');
        })->dailyAt('03:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('H');
        })->dailyAt('03:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('I');
        })->dailyAt('04:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('J');
        })->dailyAt('04:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('K');
        })->dailyAt('05:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('L');
        })->dailyAt('05:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('M');
        })->dailyAt('06:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('N');
        })->dailyAt('06:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('O');
        })->dailyAt('07:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('P');
        })->dailyAt('07:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('Q');
        })->dailyAt('08:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('R');
        })->dailyAt('08:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('S');
        })->dailyAt('09:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('T');
        })->dailyAt('09:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('U');
        })->dailyAt('10:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('V');
        })->dailyAt('10:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('W');
        })->dailyAt('11:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('X');
        })->dailyAt('11:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('Y');
        })->dailyAt('12:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('Z');
        })->dailyAt('12:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('0');
        })->dailyAt('13:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('1');
        })->dailyAt('13:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('2');
        })->dailyAt('14:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('3');
        })->dailyAt('14:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('4');
        })->dailyAt('15:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('5');
        })->dailyAt('15:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('6');
        })->dailyAt('16:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('7');
        })->dailyAt('16:30');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('8');
        })->dailyAt('17:00');
        $schedule->call(function () {
            $this->findAirportsInNeedOfContracts->execute('9');
        })->dailyAt('17:30');

        //contract generation - hubs
        $schedule->call(function () {
            $this->findHubsInNeedOfContracts->execute();
        })->daily();

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
