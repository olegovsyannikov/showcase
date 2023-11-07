<?php

namespace Modules\Funnels\Listeners;

use App\Events\UserCompleteTaskEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use InvalidArgumentException;
use Modules\Funnels\Jobs\IntercomSendJob;

final class SendResultsToIntercom implements ShouldQueue
{
    /**
     * @param UserCompleteTaskEvent $event
     *
     * @return void
     *
     * @throws InvalidArgumentException
     */
    public function handle(UserCompleteTaskEvent $event): void
    {
        $message = $event->task->formatUserAnswers($event->user);

        if (!empty($message)) {
            $userTask = $event->userTask;
            $meta = null;

            if ($userTask !== null) {
                $funnelStage = $userTask->stage;

                if ($funnelStage !== null) {
                    $lines = [
                        \sprintf(
                            '<strong>Задание:</strong> <a href="http://admin2.sober/task/view?id=%1$d" target="_blank">%1$d</a>',
                            $event->task->id
                        ),
                        "<strong>Воронка:</strong> {$funnelStage->funnel->title}",
                        "<strong>Шаг:</strong> {$funnelStage->title}",
                        "<strong>Триггер:</strong> {$userTask->trigger_id}",
                    ];

                    $meta = \implode('', \array_map(
                        fn (string $i) => "<p>{$i}</p>",
                        $lines
                    ));
                }
            }

            \dispatch(new IntercomSendJob(
                $event->userTask,
                $message,
                $meta
            ));
        }
    }
}
