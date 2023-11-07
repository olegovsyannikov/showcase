<?php

namespace Modules\Funnels\Enums;

use Spatie\Enum\Laravel\Enum;

/**
 * @method static self tasksCompleted()
 * @method static self enterFunnelStage()
 * @method static self paymentReceived()
 */
final class TriggerConditionType extends Enum
{
    /**
     * {@inheritdoc}
     */
    protected static function values(): array
    {
        return [
            'tasksCompleted' => 'tasks_completed',
            'enterFunnelStage' => 'enter_funnel_stage',
            'paymentReceived' => 'payment_received',
        ];
    }
}
