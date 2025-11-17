<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Services\General\TrackerUrl;

class GetTrackerVersionController extends Controller
{
    public function __invoke(TrackerUrl $trackerUrl)
    {
        // Cache the version data for 12 hours, but refresh after 6
        $verData = $trackerUrl->execute();

        if (empty($verData) || !isset($verData['version']))
            return response()->noContent(404);

        $verNum = $verData['version'];
        $url = $verData['url'];

    $body = <<<XMLBODY
<?xml version="1.0" encoding="UTF-8"?>
<item>
    <version>$verNum</version>
    <url>$url</url>
    <changelog>https://github.com/bushdivers/bushtracker/releases</changelog>
    <mandatory>true</mandatory>
</item>
XMLBODY;

        return response($body)->header('Content-Type', 'text/xml', true);
    }
}