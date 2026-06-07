<?php

namespace App\Providers;

use App\Events\PirepFiled;
use App\Listeners\CalculatePoints;
use App\Listeners\CheckPilotAwards;
use App\Listeners\CheckPilotRank;
use App\Listeners\UpdateAircraft;
use App\Listeners\UpdatePilotFlights;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<string, array<int, string>>
     */
    protected $listen = [
        PirepFiled::class => [
            UpdatePilotFlights::class,
            UpdateAircraft::class,
            CheckPilotRank::class,
            CheckPilotAwards::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
