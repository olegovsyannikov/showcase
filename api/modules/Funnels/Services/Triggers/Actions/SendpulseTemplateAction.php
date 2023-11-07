<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Illuminate\Support\Arr;
use Modules\Funnels\Jobs\SendpulseTemplateSendJob;
use Modules\Funnels\Services\Triggers\Exceptions\InvalidActionSignatureException;

final class SendpulseTemplateAction extends AbstractAction
{
    /**
     * {@inheritdoc}
     */
    public function getDelayKey(): string
    {
        return 'delayed_sendpulse';
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

        /** @var int|null $templateId */
        $templateId = Arr::get($actionData, 'payload.template_id', null);
        if ($templateId === null) {
            throw new InvalidActionSignatureException('Template ID not found');
        }

        $subject = Arr::get($actionData, 'payload.subject', null);
        if ($subject === null) {
            throw new InvalidActionSignatureException('Email subject not found');
        }

        $user = $this->getTriggerContext()->getUser();

        $variables = \array_merge(
            Arr::get($actionData, 'payload.variables', []),
            $this->executionContext,
            $this->makePrefixedData(
                'user',
                $user->only([
                        'id',
                        'name',
                        'email',
                        'birthday',
                        'city',
                        'timezone',
                        'tariff_plan',
                        'phone',
                        'status',
                        'language',
                    ])
            ),
        );

        $this->dispatch(new SendpulseTemplateSendJob($subject, $user->id, $templateId, $variables));
    }

    /**
     * @param string $prefix
     * @param array  $data
     *
     * @return array
     */
    private function makePrefixedData(string $prefix, array $data): array
    {
        return \array_combine(
            \array_map(fn ($k) => \sprintf('%s_%s', $prefix, $k), \array_keys($data)),
            \array_values($data)
        );
    }
}
