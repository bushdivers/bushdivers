<?php

namespace App\Services\Finance;

class CalcMonthlyFees
{
    protected CalcHubFees $calcHubFees;
    protected CalcAircraftFees $calcAircraftFees;

    public function __construct(
        CalcHubFees $calcHubFees,
        CalcAircraftFees $calcAircraftFees
    )
    {
        $this->calcHubFees = $calcHubFees;
        $this->calcAircraftFees = $calcAircraftFees;
    }

    public function execute()
    {
        $this->calcHubFees->execute();
        $this->calcAircraftFees->execute();
    }
}
