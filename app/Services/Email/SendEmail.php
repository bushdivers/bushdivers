<?php

namespace App\Services\Email;

use Mailjet;

class SendEmail
{
    protected string $apiKey;
    protected string $secret;
    protected Mailjet\Client $mj;

    public function __construct()
    {
        $this->apiKey = '45d85c59b918b3a27f90f90223218238';
        $this->secret = 'a89e59b7c7761a992d805a2f62e460ed';
        $this->mj = new Mailjet\Client($this->apiKey, $this->secret, true, ['version' => 'v3.1']);
    }

    public function execute($body)
    {
        $this->mj->post(Mailjet\Resources::$Email, ['body' => $body]);
    }
}
