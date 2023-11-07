<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Modules\Accounting\Entities\User;

final class UserCreatedEvent
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var int
     */
    private int $userId;

    /**
     * @var string|null
     */
    private ?string $role;

    /**
     * @param int         $userId
     * @param string|null $role
     *
     * @return void
     */
    public function __construct(int $userId, ?string $role = null)
    {
        $this->userId = $userId;
        $this->role = $role;
    }

    /**
     * @return User
     *
     * @throws ModelNotFoundException
     */
    public function getUser(): User
    {
        return User::findOrFail($this->userId);
    }

    /**
     * @return string|null
     */
    public function getRole(): ?string
    {
        return $this->role;
    }
}
