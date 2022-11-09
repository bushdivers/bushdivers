<?php

namespace App\Services\Finance;

class CalculateAvailableLoans
{
    public function execute(float $currentAssets, float $fixedAssets, float $liabilities, bool $defaulted): float
    {
        $totalAssets = ($currentAssets - $liabilities) + $fixedAssets;
        $total = $totalAssets - $liabilities;
        if ($total <= 0) return 0;
        if ($defaulted) return $total * 1.5;
        return $total * 3;
    }
}
