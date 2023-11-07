<?php

namespace Modules\Funnels\Services\Triggers\Conditions;

use Illuminate\Support\Arr;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\Trigger;

final class UserRolesCondition implements ConditionInterface
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
        $roles = Arr::get(
            $this->trigger->condition,
            'payload.user_roles',
            []
        );

        if (!empty($roles) && \is_array($roles)) {
            return $this->user->hasAnyRole($roles);
        }

        return true;
    }
}
