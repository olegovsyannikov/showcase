<?php

namespace Modules\Funnels\Services\Triggers\Conditions;

use Illuminate\Support\Arr;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\Trigger;
use Modules\Funnels\Enums\TriggerConditionType;
use Modules\Funnels\Services\Triggers\Exceptions\InvalidConditionSignatureException;

final class TasksCompletedCondition implements ConditionInterface
{
    public const MATCH_TYPE_ANY = 'any';
    public const MATCH_TYPE_ONE = 'one';
    public const MATCH_TYPE_ALL = 'all';
    public const MATCH_TYPE_NONE = 'none';

    /**
     * @var User
     */
    private User $user;

    /**
     * @var Trigger
     */
    private Trigger $trigger;

    /**
     * @var int|null
     */
    private ?int $taskId;

    /**
     * @param User    $user
     * @param Trigger $trigger
     *
     * @return void
     */
    public function __construct(User $user, Trigger $trigger, ?int $taskId = null)
    {
        $this->user = $user;
        $this->trigger = $trigger;
        $this->taskId = $taskId;
    }

    /**
     * {@inheritdoc}
     */
    public function match(): bool
    {
        $type = $this->trigger->condition['type'] ?? null;

        if ($type === TriggerConditionType::tasksCompleted()->value) {
            $conditionIds = Arr::get(
                $this->trigger->condition,
                'payload.ids',
                []
            );

            $conditionMatchType = Arr::get(
                $this->trigger->condition,
                'payload.match_type',
                null
            );
            if ($conditionMatchType !== null) {
                if ($this->taskId === null) {
                    throw new InvalidConditionSignatureException(\__('Condition match type expects task ID not to be null'));
                }

                if ($conditionMatchType === self::MATCH_TYPE_ALL) {
                    return $this
                        ->user
                        ->finishedTasks()
                        ->pluck('task_id')
                        ->intersect($conditionIds)
                        ->count() === \count($conditionIds);
                }

                if ($conditionMatchType === self::MATCH_TYPE_ANY) {
                    return \in_array($this->taskId, $conditionIds);
                }

                if ($conditionMatchType === self::MATCH_TYPE_NONE) {
                    return !\in_array($this->taskId, $conditionIds);
                }
            } else {
                /*
                 * TODO: remove when all triggers will be fixed
                 */
                /* start **/
                if ($conditionIds === '*') {
                    return true;
                }

                $completedIdsCount = $this
                    ->user
                    ->finishedTasks()
                    ->pluck('task_id')
                    ->intersect($conditionIds)
                    ->count();

                return \count($conditionIds) === $completedIdsCount;
                /* end **/
            }
        }

        return false;
    }
}
