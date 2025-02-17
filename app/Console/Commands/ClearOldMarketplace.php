<?php

namespace App\Console\Commands;

use App\Services\Aircraft\RemoveUnusedMarketplaceItems;
use Illuminate\Console\Command;

class ClearOldMarketplace extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'va:clear-marketplace';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear old marketplace aircraft';

    protected RemoveUnusedMarketplaceItems $removeUnusedMarketplaceItems;

    public function __construct(RemoveUnusedMarketplaceItems $removeUnusedMarketplaceItems)
    {
        parent::__construct();
        $this->removeUnusedMarketplaceItems = $removeUnusedMarketplaceItems;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $deleted = $this->removeUnusedMarketplaceItems->execute();
        $this->info('Deleted ' . $deleted . ' marketplace aircraft');
    }
}
