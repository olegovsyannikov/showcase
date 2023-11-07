<?php

namespace Modules\Funnels\Services\Triggers;

use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Entities\Trigger;
use Modules\Funnels\Services\Triggers\Actions\DatabaseDelayParser;

final class TriggerContext implements TriggerContextInterface
{
    /**
     * @var Trigger
     */
    private Trigger $trigger;

    /**
     * @var User
     */
    private User $user;

    /**
     * @var FunnelStage
     */
    private FunnelStage $funnelStage;

    /**
     * @var DatabaseDelayParser
     */
    private DatabaseDelayParser $actionDelayParser;

    /**
     * @param User        $user
     * @param FunnelStage $funnelStage
     * @param Trigger     $trigger
     *
     * @return void
     */
    public function __construct(Trigger $trigger, User $user, FunnelStage $funnelStage)
    {
        $this->trigger = $trigger;
        $this->user = $user;
        $this->funnelStage = $funnelStage;
        $this->actionDelayParser = new DatabaseDelayParser($user, $funnelStage, $trigger);
    }

    /**
     * {@inheritdoc}
     */
    public function getTrigger(): Trigger
    {
        return $this->trigger;
    }

    /**
     * {@inheritdoc}
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * {@inheritdoc}
     */
    public function getFunnelStage(): FunnelStage
    {
        return $this->funnelStage;
    }

    /**
     * {@inheritdoc}
     */
    public function getDelayParser(): DatabaseDelayParser
    {
        return $this->actionDelayParser;
    }
}
