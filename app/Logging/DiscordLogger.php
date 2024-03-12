<?php

namespace App\Logging;

use Illuminate\Support\Facades\Http;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\LogRecord;

class DiscordLogger extends AbstractProcessingHandler {

    protected $webhookUrl;

    public function __construct($webhook, $level = 'error', $bubble = true)
    {
        $this->webhookUrl = $webhook;

        parent::__construct($level, $bubble);
    }

    protected function write(LogRecord $record): void
    {
        if (empty($this->webhookUrl))
            return;

        // Trim result
        $message = implode("\n", array_slice(explode("\n", $record->formatted, 8), 0, 7));

        Http::post($this->webhookUrl, [
            'content' => "**An error occurred**\n\n```$message```"
        ]);
    }
}
