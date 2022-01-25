<?php

namespace Tests\Unit\Geo;

use App\Services\Geo\CreatePolygon;
use App\Services\Geo\IsPointInPolygon;
use PHPUnit\Framework\TestCase;

class IsPointInPolygonTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_egbj_in_50m_radius_egbs()
    {
        $p = new CreatePolygon();
        $polygon = $p->execute(52.24166, -2.88111, 50);

        $polyChecker = new IsPointInPolygon();
        $res = $polyChecker->execute([51.89417, -2.16722], $polygon);
        $this->assertTrue($res);
    }

    public function test_lfpg_not_in_50m_radius_egbs()
    {
        $p = new CreatePolygon();
        $polygon = $p->execute(52.24166, -2.88111, 50);

        $polyChecker = new IsPointInPolygon();
        $res = $polyChecker->execute([49.00978, 2.54774], $polygon);
        $this->assertFalse($res);
    }
}
