<?php

namespace Modules\Funnels\Services\Triggers\Conditions;

interface ConditionInterface
{
    /**
     * Check if given data match condition.
     *
     * @return bool
     */
    public function match(): bool;
}
