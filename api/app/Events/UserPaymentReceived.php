<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Modules\Accounting\Entities\User;
use Modules\Finance\Entities\Payment;

final class UserPaymentReceived
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var Payment
     */
    public $payment;

    /**
     * @var User|null
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(int $paymentId, ?int $userId = null)
    {
        $this->payment = Payment::findOrFail($paymentId);

        $this->user = null;
        if ($userId) {
            $this->user = User::findOrFail($userId);
        }
    }
}
