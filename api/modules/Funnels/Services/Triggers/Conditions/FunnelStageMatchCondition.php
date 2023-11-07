<?php

namespace Modules\Funnels\Services\Triggers\Conditions;

use Illuminate\Support\Arr;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\Trigger;

final class FunnelStageMatchCondition implements ConditionInterface
{
    /**
     * @var User
     */
    private User $user;

    /**
     * @var Trigger
     */
    private Trigger $trigger;

    /**
     * @param User    $user
     * @param Trigger $trigger
     *
     * @return void
     */
    public function __construct(User $user, Trigger $trigger)
    {
        $this->user = $user;
        $this->trigger = $trigger;
    }

    /**
     * {@inheritdoc}
     */
    public function match(): bool
    {
        $funnelStagesIds = Arr::get(
            $this->trigger->condition,
            'payload.user_funnel_stages_ids',
            null
        );

        if (\is_array($funnelStagesIds)) {
            return $this->user
                ->activeStages()
                ->orWhere(\array_map(
                    fn (int $id) => ['id', '=', $id],
                    $funnelStagesIds
                ))
                ->exists();
        }

        return true;
    }
}
