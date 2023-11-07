<?php

namespace Modules\Funnels\Services\Triggers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\TriggerUser;
use Modules\Funnels\Entities\TriggerUserAction;
use Modules\Funnels\Services\Triggers\Actions\ActionInterface;
use Modules\Funnels\Services\Triggers\Conditions\ConditionInterface;

final class TriggerService implements TriggerServiceInterface
{
    /**
     * @var TriggerContext
     */
    private TriggerContextInterface $triggerContext;

    /**
     * @var ActionStrategyInterface
     */
    private ActionStrategyInterface $actionsStrategy;

    /**
     * @var iterable
     */
    private iterable $conditions = [];

    /**
     * @param TriggerContextInterface $context
     * @param ActionStrategyInterface $actionsStrategy
     *
     * @return void
     */
    public function __construct(TriggerContextInterface $context, ActionStrategyInterface $actionsStrategy)
    {
        $this->triggerContext = $context;
        $this->actionsStrategy = $actionsStrategy;
    }

    /**
     * @param iterable $conditions
     *
     * @return self
     */
    public function withConditions(iterable $conditions): self
    {
        $this->conditions = $conditions;

        return $this;
    }

    /**
     * {@inheritdoc}
     */
    public function getConditions(): iterable
    {
        return $this->conditions;
    }

    /**
     * {@inheritdoc}
     */
    public function getContext(): TriggerContextInterface
    {
        return $this->triggerContext;
    }

    /**
     * {@inheritdoc}
     */
    public function matchConditions(): bool
    {
        return Collection::make($this->getConditions())->reduce(
            fn (bool $carry, ConditionInterface $condition) => $carry && $condition->match(),
            true
        );
    }

    /**
     * {@inheritdoc}
     */
    public function executeActions(array $executionContext = []): void
    {
        if ($this->matchConditions()) {
            $user = $this->getContext()->getUser();
            $trigger = $this->getContext()->getTrigger();

            /** @var Collection<ActionInterface> */
            $actions = Collection::make($this->triggerContext->getTrigger()->actions)->map(function ($actionData) {
                return $this->actionsStrategy->createAction(
                    $actionData,
                    $this->getContext()
                );
            });

            if ($this->hasIncompleteTry()) {
                $failedActionTypes = TriggerUserAction::where('status', ActionInterface::STATUS_FAIL)
                    ->where('user_id', $user->id)
                    ->where('trigger_id', $trigger->id)
                    ->pluck('type')
                    ->toArray();

                $actions
                    ->filter(fn (ActionInterface $action) => \in_array($action->getType(), $failedActionTypes))
                    ->each(function (ActionInterface $action) use ($user, $trigger, $executionContext) {
                        $this->executeAction($action, $user->id, $trigger->id, $executionContext);
                    });
            } else {
                if (!$this->isReachExecutionLimit()) {
                    TriggerUser::create([
                        'user_id' => $user->id,
                        'trigger_id' => $trigger->id,
                    ]);

                    foreach ($actions as $action) {
                        $this->executeAction($action, $user->id, $trigger->id, $executionContext);
                    }
                }
            }
        }
    }

    /**
     * @param ActionInterface $action
     * @param int             $userId
     * @param int             $triggerId
     * @param array           $context
     *
     * @return void
     */
    private function executeAction(ActionInterface $action, int $userId, int $triggerId, array $context): void
    {
        $actionRecord = TriggerUserAction::firstOrCreate(
            [
                'user_id' => $userId,
                'trigger_id' => $triggerId,
                'type' => $action->getType(),
            ],
            [
                'status' => $action::STATUS_IS_RUNNING,
            ],
        );

        if ($action->shouldExecute()) {
            $action->execute($context);
        } else {
            $actionRecord->status = $action::STATUS_OK;
            $actionRecord->save();
        }
    }

    /**
     * @return bool
     */
    private function isReachExecutionLimit(): bool
    {
        if ($this->triggerContext->getTrigger()->max_executions === 0) {
            return false;
        }

        return User::whereHas(
            'triggers',
            function (Builder $q): void {
                $q
                    ->where('trigger_id', $this->triggerContext->getTrigger()->id)
                    ->where('user_id', $this->triggerContext->getUser()->id);
            },
            '>=',
            $this->triggerContext->getTrigger()->max_executions
        )->exists();
    }

    /**
     * @return bool
     */
    private function hasIncompleteTry(): bool
    {
        return User::whereHas(
            'triggers',
            function (Builder $q): void {
                $q
                    ->where('trigger_id', $this->triggerContext->getTrigger()->id)
                    ->where('user_id', $this->triggerContext->getUser()->id)
                    ->whereNull('completed_at');
            }
        )->exists();
    }
}
