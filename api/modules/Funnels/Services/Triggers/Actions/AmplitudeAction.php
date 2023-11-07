<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Illuminate\Support\Arr;
use Modules\Funnels\Jobs\SendAmplitudeEventJob;

final class AmplitudeAction extends AbstractAction
{
    /**
     * {@inheritdoc}
     */
    public function getDelayKey(): string
    {
        return 'delayed_amplitude';
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

        $payload = \array_merge(
            Arr::get($actionData, 'payload', []),
            $this->executionContext
        );

        $stage = $this->getTriggerContext()->getFunnelStage();
        $trigger = $this->getTriggerContext()->getTrigger();
        $user = $this->getTriggerContext()->getUser();

        $sendingData = $payload + [
            'funnel_stage' => $stage->toArray(),
            'trigger' => $trigger->toArray(),
        ];

        $this->dispatch(new SendAmplitudeEventJob($user, $sendingData));
    }
}
