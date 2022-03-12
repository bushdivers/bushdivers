<?php

namespace App\Console\Commands;

use App\Services\Contracts\FindAirportsInNeedOfContracts;
use Illuminate\Console\Command;

class GenerateContracts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contracts:generate {letter}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    protected FindAirportsInNeedOfContracts $findAirportsInNeedOfContracts;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(FindAirportsInNeedOfContracts $findAirportsInNeedOfContracts)
    {
        parent::__construct();
        $this->findAirportsInNeedOfContracts = $findAirportsInNeedOfContracts;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $letter = $this->argument('letter');
        $this->findAirportsInNeedOfContracts->execute($letter);
    }
}
