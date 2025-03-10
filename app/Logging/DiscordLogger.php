<?php

namespace App\Logging;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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
        $message = str_replace('`', '', $message);
        $message = "**An error occurred**\n\n```$message```";
        // 2000 character cap
        $message = substr($message, 0, 2000);

        $response = Http::post($this->webhookUrl, [
            'content' => $message,
        ]);

        if ($response->status() >= 300)
            Log::channel('single')->error('DiscordLogger: Failed to send message to Discord', ['response' => $response->body(), 'status' => $response->status()]);
    }
}
