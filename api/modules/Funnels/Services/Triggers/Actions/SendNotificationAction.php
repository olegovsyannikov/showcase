<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Illuminate\Support\Arr;
use Modules\Funnels\Jobs\SendFcmJob;

final class SendNotificationAction extends AbstractAction
{
    /**
     * {@inheritdoc}
     */
    public function getDelayKey(): string
    {
        return 'delayed_notify';
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

        /** @var array $message */
        $message = Arr::get($this->getData(), 'payload.message', []);

        $this->dispatch(new SendFcmJob($user, $message));
    }
}
