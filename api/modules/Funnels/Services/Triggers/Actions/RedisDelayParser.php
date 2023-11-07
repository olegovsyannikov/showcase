<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Enums\TriggerActionType;

final class RedisDelayParser implements ActionDelayParserInterface
{
    /**
     * @var User
     */
    private User $user;

    /**
     * @var FunnelStage
     */
    private FunnelStage $funnelStage;

    /**
     * @param User        $user
     * @param FunnelStage $funnelStage
     *
     * @return void
     */
    public function __construct(User $user, FunnelStage $funnelStage)
    {
        $this->user = $user;
        $this->funnelStage = $funnelStage;
    }

    /**
     * {@inheritdoc}
     */
    public function getDelay(array $data): int
    {
        $timezone = $this->user->timezone;
        $delay = Arr::get($data, 'payload.delay', 0);
        $daytimeAfter = Arr::get($data, 'payload.daytime_after', null);

        if ($daytimeAfter !== null) {
            try {
                $now = Carbon::now($timezone);
                $daytimeAfterDt = Carbon::parse($daytimeAfter, $timezone);
            } catch (\Throwable $th) {
                $now = Carbon::now();
                $daytimeAfterDt = Carbon::parse($daytimeAfter);
            }

            if ($daytimeAfterDt > $now && ($diff = $daytimeAfterDt->diffInSeconds($now)) > $delay) {
                $delay = $diff;
            }
        }

        $stageTasksIds = $this->funnelStage
            ->triggers()
            ->where('actions->type', TriggerActionType::assignTasks()->value)
            ->get()
            ->reduce(function ($carry, $trigger) {
                return \array_merge(
                    $carry,
                    \data_get($trigger, 'actions.payload.ids', []),
                );
            }, []);

        $delayedTasks = Cache::tags([
            "stage{$this->funnelStage->id}",
            "user{$this->user->id}",
        ])->get('delayed_tasks', []);

        $lastTask = $this->user->getLastFinishedTask($stageTasksIds);

        if ($lastTask && $lastTask->taskResult && \count($delayedTasks) === 0) {
            $delay -= Carbon::now()->diffInSeconds($lastTask->taskResult->finished_at);
            if ($delay < 0) {
                $delay = 0;
            }
        }

        return $delay;
    }

    /**
     * {@inheritdoc}
     */
    public function getDelayedData(string $key): ?string
    {
        return Cache::tags([
            "stage{$this->funnelStage->id}",
            "user{$this->user->id}",
        ])->get($key, null);
    }

    /**
     * {@inheritdoc}
     */
    public function storeDelayedData(string $key, string $data, int $delay): void
    {
        Cache::tags([
            "stage{$this->funnelStage->id}",
            "user{$this->user->id}",
        ])->put(
            $key,
            $data,
            $delay
        );
    }
}
