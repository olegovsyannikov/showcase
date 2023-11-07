<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Modules\Funnels\Jobs\RemoveUserFromFunnelStageJob;

final class RemoveFromStageAction extends AbstractAction
{
    /**
     * {@inheritdoc}
     */
    public function getDelayKey(): string
    {
        return 'delayed_remove';
    }

    /**
     * {@inheritdoc}
     */
    public function shouldExecute(): bool
    {
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function run(): void
    {
        $user = $this->getTriggerContext()->getUser();
        $funnelStage = $this->getTriggerContext()->getFunnelStage();

        $this->dispatch(new RemoveUserFromFunnelStageJob($user, $funnelStage));
    }
}
