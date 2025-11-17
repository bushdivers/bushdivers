<?php

namespace App\Services\General;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TrackerUrl
{
    public function execute(): array
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
                if (strpos($asset['name'], $v) !== false && (str_starts_with(strtolower($asset['name']), 'bushtracker') || str_starts_with(strtolower($asset['name']), 'bushdiverstracker'))) {
                    return [
                        'version' => $v,
                        'url' => $asset['browser_download_url'],
                    ];
                }
            }

            return null;
        });

        return $verData;
    }
}