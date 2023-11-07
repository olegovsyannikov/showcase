<?php

namespace Modules\Funnels\Jobs;

use App\Notifications\DummyFcmNotify;
use Modules\Accounting\Entities\User;

final class SendFcmJob extends AbstractActionJob
{
    /**
     * @var User
     */
    private User $user;

    /**
     * @var array
     */
    private array $message;

    /**
     * @param User $user
     *
     * @return void
     */
    public function __construct(User $user, array $message)
    {
        $this->user = $user;
        $this->message = $message;
    }

    /**
     * @return void
     */
    public function run(): void
    {
        $this->user->notify(new DummyFcmNotify($this->message));
    }
}
