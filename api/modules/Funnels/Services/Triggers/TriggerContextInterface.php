<?php

namespace Modules\Funnels\Services\Triggers;

use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Entities\Trigger;
use Modules\Funnels\Services\Triggers\Actions\ActionDelayParserInterface;

interface TriggerContextInterface
{
    /**
     * @return Trigger
     */
    public function getTrigger(): Trigger;

    /**
     * @return User
     */
    public function getUser(): User;

    /**
     * @return FunnelStage
     */
    public function getFunnelStage(): FunnelStage;

    /**
     * @return ActionDelayParserInterface
     */
    public function getDelayParser(): ActionDelayParserInterface;
}
