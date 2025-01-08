<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GetTrackerVersionController extends Controller
{
    public function __invoke()
    {
        // Cache the version data for 12 hours, but refresh after 6
        $verData = Cache::flexible('tracker.version', [6 * 60 * 60, 12 * 60 * 60], function () {
            $release = Http::acceptJson()->get('https://api.github.com/repos/bushdivers/bushtracker/releases/latest');

            if ($release->failed())
                return null;

            $v = $release['tag_name'];
            if ($v[0] === 'v')
                $v = substr($v, 1);

            foreach ($release['assets'] as $asset) {
                if (strpos($asset['name'], $v) !== false && str_starts_with(strtolower($asset['name']), 'bushtracker')) {
                    return [
                        'version' => $v,
                        'url' => $asset['browser_download_url'],
                    ];
                }
            }

            return null;
        });

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