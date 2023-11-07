<?php

namespace Modules\Funnels\Listeners;

use App\Events\UserPaymentReceived;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\Trigger;
use Modules\Funnels\Enums\TriggerConditionType;
use Modules\Funnels\Services\Triggers\ActionStrategyInterface;
use Modules\Funnels\Services\Triggers\Conditions\PaymentMatchCondition;
use Modules\Funnels\Services\Triggers\Conditions\TariffMatchCondition;
use Modules\Funnels\Services\Triggers\Conditions\UserMatchCondition;
use Modules\Funnels\Services\Triggers\Conditions\UserRolesCondition;
use Modules\Funnels\Services\Triggers\TriggerContext;
use Modules\Funnels\Services\Triggers\TriggerService;
use phpcent\Client as CentrifugalClient;

final class ReactToThePayment implements ShouldQueue
{
    /**
     * Delay because execute after user will enter to funnels.
     *
     * @var int
     */
    public $delay = 10;

    /**
     * @var CentrifugalClient
     */
    private CentrifugalClient $centrifugalClient;

    /**
     * @var ActionStrategyInterface
     */
    private ActionStrategyInterface $actionStrategy;

    /**
     * @param CentrifugalClient $centrifugalClient
     *
     * @return void
     */
    public function __construct(CentrifugalClient $centrifugalClient, ActionStrategyInterface $actionStrategy)
    {
        $this->centrifugalClient = $centrifugalClient;
        $this->actionStrategy = $actionStrategy;
    }

    /**
     * @param UserPaymentReceived $event
     *
     * @return void
     */
    public function handle(UserPaymentReceived $event): void
    {
        $payment = $event->payment;

        if ($payment->invoice && $payment->invoice->users()->count() > 0) {
            $user = $payment->invoice->users()->first();
        } else {
            $user = $payment->user;
        }

        /** @var User|null $user */
        if ($user) {
            $user->update([
                'tariff_plan' => $payment->tariff->plan,
            ]);
            $user->loadMissing('activeStages');

            $this->centrifugalClient->publish(
                "profile#{$user->id}",
                $user->getPrivateProfile()
            );

            $cursor = Trigger::with(['stages'])
                ->where('condition->type', TriggerConditionType::paymentReceived()->value)
                ->whereHas('stages', function (Builder $query) use ($user): void {
                    $query->whereIn('funnel_stage_id', $user->activeStages->pluck('id'));
                })
                ->cursor();

            /** @var Trigger $trigger */
            foreach ($cursor as $trigger) {
                $triggerContext = new TriggerContext($trigger, $user, $trigger->stages[0]);

                (new TriggerService($triggerContext, $this->actionStrategy))
                    ->withConditions([
                        new UserMatchCondition($user, $trigger),
                        new UserRolesCondition($user, $trigger),
                        new PaymentMatchCondition($payment, $trigger),
                        new TariffMatchCondition($payment->tariff, $trigger),
                    ])
                    ->executeActions($payment->toArray());
            }
        }
    }
}
