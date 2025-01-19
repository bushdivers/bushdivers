<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeEmail extends Notification
{
    protected User $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->greeting('Welcome!')
            ->line('Welcome ' . $this->user->name . ' to the Bush Divers community!')
            ->line('You are now a pilot for the Bush Divers virtual airline. Your pilot ID is ' . $this->user->pilot_id)
            ->line('If you have any questions, please get in touch with us via our Discord channel and check out the pilot handbook. Details are on the VA portal.')
            ->line('Thanks again for joining,')
            ->salutation('The Bush Divers Team');
    }

}