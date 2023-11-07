<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Carbon\Carbon;
use Carbon\Exceptions\InvalidCastException;
use Illuminate\Support\Arr;
use Modules\Funnels\Jobs\AssignTasksJob;

final class AssignTasksAction extends AbstractAction
{
    /**
     * {@inheritdoc}
     */
    public function getDelayKey(): string
    {
        return 'delayed_tasks';
    }

    /**
     * {@inheritdoc}
     */
    public function shouldExecute(): bool
    {
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function run(): void
    {
        $user = $this->getTriggerContext()->getUser();
        $funnelStage = $this->getTriggerContext()->getFunnelStage();
        $trigger = $this->getTriggerContext()->getTrigger();

        $delay = $this->getDelay();

        /** @var array $assignIds */
        $assignIds = Arr::get($this->getData(), 'payload.ids', []);

        $this->dispatch(new AssignTasksJob(
            $user,
            $assignIds,
            $funnelStage->id,
            $trigger->id
        ), $delay);
    }

    /**
     * @return int
     *
     * @throws InvalidCastException
     */
    private function getDelay(): int
    {
        $delay = $this
            ->getTriggerContext()
            ->getDelayParser()
            ->getDelay($this->getData());

        $stageTasksIds = $this
            ->getTriggerContext()
            ->getFunnelStage()
            ->task_ids;

        $lastTask = $this
            ->getTriggerContext()
            ->getUser()
            ->getLastFinishedTask($stageTasksIds);

        if ($lastTask && $lastTask->taskResult && $lastTask->taskResult->finished_at) {
            $delay -= Carbon::now()->diffInSeconds($lastTask->taskResult->finished_at);
        }

        return $delay;
    }
}
