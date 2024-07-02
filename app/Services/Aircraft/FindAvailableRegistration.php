<?php

namespace App\Services\Aircraft;

use App\Models\Aircraft;

class FindAvailableRegistration
{
    public function execute(?string $country): string
    {
        $valid = false;
        $reg = '';

        while ($valid == false) {
            if ($country == null || $country == '') {
                $num = mt_rand(1, 9999);
                $num = str_pad($num, 3, 0, STR_PAD_LEFT);
                $reg = 'N'.$num;
            } elseif ($country == 'PG' || $country == 'ID') {
                $num = mt_rand(1, 999);
                $num = str_pad($num, 2, 0, STR_PAD_LEFT);
                $reg = 'P2-'.$num;
            } elseif ($country == 'NZ') {
                $num = mt_rand(1, 999);
                $num = str_pad($num, 2, 0, STR_PAD_LEFT);
                $reg = 'ZL-'.$num;
            } else {
                $num = mt_rand(1, 9999);
                $num = str_pad($num, 3, 0, STR_PAD_LEFT);
                $reg = 'N'.$num;
            }

            $aircraft = Aircraft::where('registration', $reg)
                ->count();
            if ($aircraft == 0) {
                $valid = true;
            }
        }
        return $reg;
    }
}
