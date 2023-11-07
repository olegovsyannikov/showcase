<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Illuminate\Support\Arr;
use Modules\Funnels\Jobs\SendWebhookJob;
use Modules\Funnels\Services\Triggers\Exceptions\InvalidActionSignatureException;

final class WebhookAction extends AbstractAction
{
    /**
     * {@inheritdoc}
     */
    public function getDelayKey(): string
    {
        return 'delayed_webhook';
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

        /** @var string|null */
        $webhookUrl = Arr::get($actionData, 'payload.url', null);
        if ($webhookUrl === null) {
            throw new InvalidActionSignatureException('Webhook url not found');
        }

        $data = [
            'trigger' => $this->getTriggerContext()->getTrigger()->toArray(),
            'user' => $this->getTriggerContext()->getUser()->toArray(),
            'funnelStage' => $this->getTriggerContext()->getFunnelStage()->toArray(),
            'executionContext' => $this->executionContext,
        ];

        $this->dispatch(new SendWebhookJob($webhookUrl, $data));
    }
}
