<?php

namespace App\Models\Enums;

class PirepState
{
    public const DISPATCH = 1;
    public const IN_PROGRESS = 2;
    public const ACCEPTED = 3;
    public const REJECTED = 4;
    public const REVIEW = 5;

    public static $labels = [
        self::DISPATCH => 'Dispatch',
        self::IN_PROGRESS => 'In Progress',
        self::ACCEPTED => 'Accepted',
        self::REJECTED => 'Rejected'
    ];
}
