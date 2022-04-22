<?php

namespace App\Models\Enums;

class FinancialConsts
{
    // public const CompanyPay = 50;
    public const PilotPay = 50;
    public const PrivatePilotPay = 70;
    public const CancelPenalty = 10;
    public const WelcomeBonus = 200;
    public const HubBonus = 800;
    public const ExpiryMultiplier = 0.2;
    public const ContractExpiryDays = 1.1;
    public const ContractExpiryDay = 1.15;
    public const ContractExpiryHalf = 1.2;
    public const ContractExpiryHours = 1.3;
    public const ContractExpiryHour = 1.4;
    public const ContractExpiryMins = 1.5;

    public const ContractExpiryDaysStr = 'days';
    public const ContractExpiryDayStr = 'day';
    public const ContractExpiryHalfStr = 'half';
    public const ContractExpiryHoursStr = 'hours';
    public const ContractExpiryHourStr = 'hour';
    public const ContractExpiryMinsStr = 'mins';
}
