<?php

namespace Modules\Funnels\Listeners;

use App\Events\UserCompleteTaskEvent;
use Illuminate\Contracts\Queue\ShouldQueue;

final class CheckNewTasks implements ShouldQueue
{
    /**
     * Handle the event.
     *
     * @param UserCompleteTaskEvent $event
     *
     * @return void
     */
    public function handle(UserCompleteTaskEvent $event): void
    {
        $event->user->checkState($event->task->id);
    }
}
