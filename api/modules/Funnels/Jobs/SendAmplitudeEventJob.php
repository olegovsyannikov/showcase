<?php

namespace Modules\Funnels\Jobs;

use Modules\Accounting\Entities\User;
use Modules\Finance\Entities\Tariff;
use Zumba\Amplitude\Amplitude;

final class SendAmplitudeEventJob extends AbstractActionJob
{
    public const REVENUE_EVENT_TYPE = '[Amplitude] Revenue';
    public const TRIAL_EVENT_TYPE = 'start_trial';

    public const TYPE_SUBSCRIPTION = 'subscription';
    public const TYPE_TRIAL = 'trial';

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * @var User
     */
    private $user;

    /**
     * @var array
     */
    private $data;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user, array $data)
    {
        $this->user = $user;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function run(): void
    {
        $amplitude = \resolve(Amplitude::class);

        $this->user->refresh();

        if (isset($this->data['tariff_id'])) {
            $tariff = Tariff::findOrFail($this->data['tariff_id']);

            if ($this->isTrial($this->data)) {
                $this->data['event_type'] = static::TRIAL_EVENT_TYPE;
            } else {
                $this->data = \array_merge($this->data, [
                    'event_type' => static::REVENUE_EVENT_TYPE,
                    'quantity' => $tariff->min_months,
                    'price' => $tariff->month_amount,
                    'revenue' => $this->data['amount'],
                    'productId' => "tariff-{$tariff->id}",
                    'revenueType' => static::TYPE_SUBSCRIPTION,
                ]);
            }
        }

        $amplitude
            ->setUserId((string) $this->user->id)
            ->setUserProperties([
                's1_admin' => "https://admin2.sober/user/view?id={$this->user->id}",
                's1_has_userpic' => isset($this->user->userpic) ? 1 : 0,
                's1_status' => $this->user->status,
                's1_birthdate_at' => $this->user->birthdate,
                's1_city' => $this->user->city,
                's1_telegram' => $this->user->telegram,
                's1_stage' => $this->user->stage,
                's1_group' => $this->user->group,
                's1_internal_comment' => $this->user->internal_comment,
                's1_sobriety_started_at' => $this->user->sobriety_started_at,
                's1_is_chat_available' => $this->user->is_chat_available,
                's1_new_tasks' => $this->user->new_tasks_count,
                's1_in_progress_tasks' => $this->user->in_progress_tasks_count,
                's1_finished_tasks' => $this->user->finished_tasks_count,
                's1_is_paid' => $this->user->is_paid,
                's1_subscription_end_at' => $this->user->paid_until,
                's1_payments_amount' => $this->user->payments_amount,
                's1_payments_quantity' => $this->user->payments_quantity,
                's1_recurring_subscription' => $this->user->recurring_subscription,
                's1_tariff_plan' => $this->user->tariff_plan,
                's1_split_test_code' => $this->user->split_test_code,
                's1_goal' => $this->user->goal,
                's1_language' => $this->user->language,
            ])
            ->logEvent(
                $this->data['event_type'],
                $this->data
            );
    }

    /**
     * @param array $data
     *
     * @return bool
     */
    private function isTrial(array $data): bool
    {
        return isset($data['amount']) && (int) $data['amount'] === 1;
    }
}
