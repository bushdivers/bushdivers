<?php

namespace App\Services\Finance;

class CalculateAvailableLoans
{
    public function execute(float $currentAssets, float $fixedAssets, float $liabilities): float
    {
        $totalAssets = ($currentAssets - $liabilities) + $fixedAssets;
        $total = $totalAssets - $liabilities;
        if ($total <= 0) return 0;
        $basicLoanAmount = $total * 3;

        return $basicLoanAmount;
    }
}
