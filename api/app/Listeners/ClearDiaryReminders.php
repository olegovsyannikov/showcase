<?php

namespace App\Listeners;

use App\Enums\ReminderTypeEnum;
use App\Events\UserLoggedEvent;

final class ClearDiaryReminders
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     *
     * @param UserLoggedEvent $event
     *
     * @return void
     */
    public function handle(UserLoggedEvent $event): void
    {
        $event
            ->user
            ->reminders()
            ->ofType(ReminderTypeEnum::diary())
            ->delete();
    }
}
