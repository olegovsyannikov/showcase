<?php

namespace Modules\Funnels\Services\Triggers\Conditions;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\Trigger;

final class UserMatchCondition implements ConditionInterface
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
        $attributes = Arr::get(
            $this->trigger->condition,
            'payload.user_attr',
            null
        );

        if ($attributes) {
            $subset = Collection::make($attributes)->takeWhile(function (array $attr) {
                if (\count($attr) === 2) {
                    [$param, $value] = $attr;

                    if (\is_array($value)) {
                        return \in_array($this->user->{$param}, $value);
                    }

                    return $this->user->{$param} === $value;
                }

                return true;
            });

            return \count($attributes) === $subset->count();
        }

        return true;
    }
}
