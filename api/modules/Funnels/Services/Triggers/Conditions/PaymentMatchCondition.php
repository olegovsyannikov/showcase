<?php

namespace Modules\Funnels\Services\Triggers\Conditions;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Modules\Finance\Entities\Payment;
use Modules\Funnels\Entities\Trigger;

final class PaymentMatchCondition implements ConditionInterface
{
    /**
     * @var Payment
     */
    private Payment $payment;

    /**
     * @var Trigger
     */
    private Trigger $trigger;

    /**
     * @param Payment $payment
     * @param Trigger $trigger
     *
     * @return void
     */
    public function __construct(Payment $payment, Trigger $trigger)
    {
        $this->payment = $payment;
        $this->trigger = $trigger;
    }

    /**
     * {@inheritdoc}
     */
    public function match(): bool
    {
        $attributes = Arr::get(
            $this->trigger->condition,
            'payload.payment_attr',
            null
        );

        if ($attributes) {
            $subset = Collection::make($attributes)->takeWhile(function (array $attr) {
                if (\count($attr) === 2) {
                    [$param, $value] = $attr;

                    if (\is_array($value)) {
                        return \in_array($this->payment->{$param}, $value);
                    }

                    return $this->payment->{$param} === $value;
                }

                return true;
            });

            return \count($attributes) === $subset->count();
        }

        return true;
    }
}
