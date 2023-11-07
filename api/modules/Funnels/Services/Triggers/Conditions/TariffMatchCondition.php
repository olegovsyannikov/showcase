<?php

namespace Modules\Funnels\Services\Triggers\Conditions;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Modules\Finance\Entities\Tariff;
use Modules\Funnels\Entities\Trigger;

final class TariffMatchCondition implements ConditionInterface
{
    /**
     * @var Tariff
     */
    private Tariff $tariff;

    /**
     * @var Trigger
     */
    private Trigger $trigger;

    /**
     * @param Tariff  $tariff
     * @param Trigger $trigger
     *
     * @return void
     */
    public function __construct(Tariff $tariff, Trigger $trigger)
    {
        $this->tariff = $tariff;
        $this->trigger = $trigger;
    }

    /**
     * {@inheritdoc}
     */
    public function match(): bool
    {
        $attributes = Arr::get(
            $this->trigger->condition,
            'payload.tariff_attr',
            null
        );

        if ($attributes) {
            $subset = Collection::make($attributes)->takeWhile(function (array $attr) {
                if (\count($attr) === 2) {
                    [$param, $value] = $attr;

                    if (\is_array($value)) {
                        return \in_array($this->tariff->{$param}, $value);
                    }

                    return $this->tariff->{$param} === $value;
                }

                return true;
            });

            return \count($attributes) === $subset->count();
        }

        return true;
    }
}
