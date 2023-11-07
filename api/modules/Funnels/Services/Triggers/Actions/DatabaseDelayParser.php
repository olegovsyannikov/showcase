<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Carbon\Carbon;
use Illuminate\Support\Arr;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\ActionDelay;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Entities\Trigger;

final class DatabaseDelayParser implements ActionDelayParserInterface
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
     * @var Trigger
     */
    private Trigger $trigger;

    /**
     * @param User        $user
     * @param FunnelStage $funnelStage
     * @param Trigger     $trigger
     *
     * @return void
     */
    public function __construct(User $user, FunnelStage $funnelStage, Trigger $trigger)
    {
        $this->user = $user;
        $this->funnelStage = $funnelStage;
        $this->trigger = $trigger;
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

            if ($daytimeAfterDt > $now) {
                $diff = $daytimeAfterDt->diffInSeconds($now);
                if ($diff > $delay) {
                    $delay = $diff;
                }
            } else {
                $finalDateTime = $now->copy()->addSeconds($delay);
                if ($finalDateTime->day > $now->day) {
                    $diff = $daytimeAfterDt->copy()->addDay()->diffInSeconds($now);
                    if ($diff > $delay) {
                        $delay = $diff;
                    }
                }
            }
        }

        return $delay;
    }

    /**
     * {@inheritdoc}
     */
    public function getDelayedData(string $key): ?string
    {
        /** @var ActionDelay|null $actionDelay */
        $actionDelay = ActionDelay::where('key_code', $key)
            ->where('user_id', $this->user->id)
            ->where('funnel_stage_id', $this->funnelStage->id)
            ->where('trigger_id', $this->trigger->id)
            ->where('should_run_at', '>=', Carbon::now())
            ->whereNull('processed_at')
            ->first();

        if ($actionDelay !== null) {
            return $actionDelay->data;
        }

        return null;
    }

    /**
     * {@inheritdoc}
     */
    public function storeDelayedData(string $key, string $data, int $delay): void
    {
        ActionDelay::updateOrCreate(
            [
                'user_id' => $this->user->id,
                'funnel_stage_id' => $this->funnelStage->id,
                'trigger_id' => $this->trigger->id,
                'key_code' => $key,
            ],
            [
                'data' => $data,
                'should_run_at' => Carbon::now()->addSeconds($delay),
            ]
        );
    }
}
