<?php

namespace App\Services\Email;

use Illuminate\Support\Facades\Log;
use Mailjet;

class SendEmail
{
    protected string $apiKey;
    protected string $secret;
    protected Mailjet\Client $mj;

    public function __construct()
    {
        $this->apiKey = config('mail.mailers.mailjet.api_key', '');
        $this->secret = config('mail.mailers.mailjet.api_secret', '');
        $this->mj = new Mailjet\Client($this->apiKey, $this->secret, true, ['version' => 'v3.1']);
    }

    public function execute($body): bool
    {
        $mail = $this->mj->post(Mailjet\Resources::$Email, ['body' => $body]);
        if ($mail->success())
            return true;

        Log::error('Error sending email', ['error' => $mail->getData()]);
        return false;
    }
}
