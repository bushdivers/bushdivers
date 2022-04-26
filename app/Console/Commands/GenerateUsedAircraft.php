<?php

namespace App\Console\Commands;

use App\Services\Aircraft\GenerateAircraft;
use Illuminate\Console\Command;

class GenerateUsedAircraft extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:aircraft';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate used aircraft';

    protected GenerateAircraft $generateAircraft;

    public function __construct(GenerateAircraft $generateAircraft)
    {
        parent::__construct();
        $this->generateAircraft = $generateAircraft;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->generateAircraft->generateAll();
        return 0;
    }
}
