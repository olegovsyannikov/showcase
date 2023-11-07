<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Modules\Funnels\Entities\Funnel;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Jobs\AddUserToFunnelStageJob;

final class ChangeStageAction extends AbstractAction
{
    /**
     * {@inheritdoc}
     */
    public function getDelayKey(): string
    {
        return 'delayed_change';
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
        $actionData = $this->getData();

        $position = Arr::get($actionData, 'payload.position', 0);

        try {
            $funnelId = Arr::get($actionData, 'payload.funnel', null);
            $funnel = Funnel::findOrFail($funnelId);
        } catch (ModelNotFoundException $th) {
            $funnel = $this->getTriggerContext()->getFunnelStage()->funnel;
        }

        /** @var FunnelStage|null $stage */
        $stage = $funnel
            ->stages()
            ->where('position', $position)
            ->first();

        $this->dispatch(new AddUserToFunnelStageJob(
            $this->getTriggerContext()->getUser(),
            $stage
        ));
    }
}
