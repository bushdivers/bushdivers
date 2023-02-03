<?php

namespace App\Services\General;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LogSchedule
{
    public function execute(string $operation, bool $success): void
    {
        DB::table('schedule_logs')->insert([
            'operation' => $operation,
            'is_success' => $success,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}
