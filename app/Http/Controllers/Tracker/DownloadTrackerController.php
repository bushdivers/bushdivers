<?php

namespace App\Http\Controllers\Tracker;
use App\Http\Controllers\Controller;
use App\Services\General\TrackerUrl;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class DownloadTrackerController extends Controller
{
    public function __invoke(TrackerUrl $trackerUrl)
    {
        // Cache the version data for 12 hours, but refresh after 6
        $verData = $trackerUrl->execute();

        if (empty($verData) || !isset($verData['url']))
            throw new NotFoundHttpException('Version not found');

        $url = $verData['url'];

        return redirect($url);
    }
}
