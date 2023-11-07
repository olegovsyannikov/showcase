<?php

namespace Modules\Funnels\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Modules\Funnels\Entities\Trigger;
use Modules\Funnels\Enums\TriggerConditionType;
use Modules\Funnels\Events\UserEnterFunnelStageEvent;
use Modules\Funnels\Services\Triggers\ActionStrategyInterface;
use Modules\Funnels\Services\Triggers\Conditions\UserMatchCondition;
use Modules\Funnels\Services\Triggers\Conditions\UserRolesCondition;
use Modules\Funnels\Services\Triggers\TriggerContext;
use Modules\Funnels\Services\Triggers\TriggerService;

final class AssignFunnelStageTasks implements ShouldQueue
{
    /**
     * @var ActionStrategyInterface
     */
    private ActionStrategyInterface $actionStrategy;

    /**
     * @param ActionStrategyInterface $actionStrategy
     *
     * @return void
     */
    public function __construct(ActionStrategyInterface $actionStrategy)
    {
        $this->actionStrategy = $actionStrategy;
    }

    /**
     * Handle the event.
     *
     * @param UserEnterFunnelStageEvent $event
     */
    public function handle(UserEnterFunnelStageEvent $event): void
    {
        $event
            ->funnelStage
            ->triggers()
            ->where('condition->type', TriggerConditionType::enterFunnelStage()->value)
            ->each(function (Trigger $trigger) use ($event): void {
                $context = new TriggerContext(
                    $trigger,
                    $event->user,
                    $event->funnelStage
                );

                (new TriggerService($context, $this->actionStrategy))
                    ->withConditions([
                        new UserMatchCondition($event->user, $trigger),
                        new UserRolesCondition($event->user, $trigger),
                    ])
                    ->executeActions();
            });
    }

    /**
     * Determine whether the listener should be queued.
     *
     * @param UserEnterFunnelStageEvent $event
     *
     * @return bool
     */
    public function shouldQueue(UserEnterFunnelStageEvent $event)
    {
        return true;
    }
}
