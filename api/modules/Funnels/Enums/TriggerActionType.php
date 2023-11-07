<?php

namespace Modules\Funnels\Enums;

use Spatie\Enum\Laravel\Enum;

/**
 * @method static self assignTasks()
 * @method static self changeStage()
 * @method static self completeStage()
 * @method static self removeFromStage()
 * @method static self sendNotification()
 * @method static self sendAmplitudeEvent()
 * @method static self sendpulseTemplateSend()
 * @method static self intercomSend()
 * @method static self webhook()
 */
final class TriggerActionType extends Enum
{
    /**
     * {@inheritdoc}
     */
    protected static function values(): array
    {
        return [
            'assignTasks' => 'assign_tasks',
            'changeStage' => 'change_stage',
            'completeStage' => 'complete_stage',
            'removeFromStage' => 'remove_from_stage',
            'sendNotification' => 'send_notification',
            'sendAmplitudeEvent' => 'amplitude_event',
            'sendpulseTemplateSend' => 'sendpulse_template',
            'intercomSend' => 'intercom_send',
            'webhook' => 'webhook',
        ];
    }
}
