<?php

namespace App\Console\Commands;

use App\Services\Finance\CollectFinancePayments;
use Illuminate\Console\Command;

class CollectFinance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bd:collect';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    protected CollectFinancePayments $collectFinancePayments;

    public function __construct(CollectFinancePayments $collectFinancePayments)
    {
        parent::__construct();
        $this->collectFinancePayments = $collectFinancePayments;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->collectFinancePayments->execute();
        return 'Collected';
    }
}
