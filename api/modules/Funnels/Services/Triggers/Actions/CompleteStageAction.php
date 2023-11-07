<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Modules\Funnels\Jobs\CompleteFunnelStageJob;

final class CompleteStageAction extends AbstractAction
{
    /**
     * {@inheritdoc}
     */
    public function getDelayKey(): string
    {
        return 'delayed_complete';
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

        $this->dispatch(new CompleteFunnelStageJob($user, $funnelStage));
    }
}
