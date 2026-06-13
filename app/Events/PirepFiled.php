<?php

namespace App\Events;

use App\Models\Pirep;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PirepFiled
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(public Pirep $pirep)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array<Channel>
     */
    public function broadcastOn(): Channel|array
    {
        return new PrivateChannel('channel-name');
    }
}
