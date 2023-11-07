<?php

namespace Modules\Funnels\Services\Triggers;

use Modules\Funnels\Services\Triggers\Conditions\ConditionInterface;

interface TriggerServiceInterface
{
    /**
     * Get service context.
     *
     * @return TriggerContextInterface
     */
    public function getContext(): TriggerContextInterface;

    /**
     * Process all trigger actions.
     *
     * @param array $executionContext
     *
     * @return void
     */
    public function executeActions(array $executionContext): void;

    /**
     * @return iterable|ConditionInterface[]
     */
    public function getConditions(): iterable;

    /**
     * Check conditions match.
     *
     * @return bool
     */
    public function matchConditions(): bool;
}
