<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\User\CreateApiToken;
use Illuminate\Console\Command;

class RefreshApiToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'token:refresh {user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refreshes the user api token';

    protected CreateApiToken $createApiToken;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(CreateApiToken $createApiToken)
    {
        parent::__construct();
        $this->createApiToken = $createApiToken;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $user = User::find($this->argument('user'));
        $this->createApiToken->execute($user);
    }
}
