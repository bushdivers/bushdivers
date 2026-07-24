<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;

class CleanAirportMetar extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'va:clear-airport-weather {--months=6 : The number of months to keep station data for}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clears outdated nearest METAR stations for airports';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $months = (int) $this->option('months');
        $cutoffDate = Carbon::now()->subMonths($months);

        $deletedCount = \App\Models\Airport::where('metar_added_at', '<', $cutoffDate)
            ->update([
                'primary_metar' => null,
                'secondary_metar' => null,
                'metar_added_at' => null,
            ]);

        $this->info("Cleared METAR data for {$deletedCount} airports older than {$months} months.");
    }
}
