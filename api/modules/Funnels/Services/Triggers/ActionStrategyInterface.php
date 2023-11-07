<?php

namespace Modules\Funnels\Services\Triggers;

use Modules\Funnels\Services\Triggers\Actions\ActionInterface;

interface ActionStrategyInterface
{
    /**
     * @param array                   $data
     * @param TriggerContextInterface $context
     *
     * @return ActionInterface
     */
    public function createAction(array $data, TriggerContextInterface $context): ActionInterface;
}
