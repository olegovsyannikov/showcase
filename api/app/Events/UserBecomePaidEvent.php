<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Modules\Accounting\Entities\User;

final class UserBecomePaidEvent
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var User
     */
    public $user;

    /**
     * @var bool
     */
    public $isInitial;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(int $userId, bool $isInitial)
    {
        $this->user = User::findOrFail($userId);
        $this->isInitial = $isInitial;
    }
}
