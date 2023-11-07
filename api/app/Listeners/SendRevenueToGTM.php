<?php

namespace App\Listeners;

use App\Events\UserPaymentReceived;
use Irazasyed\LaravelGAMP\Facades\GAMP;

final class SendRevenueToGTM
{
    /**
     * Handle the event.
     *
     * @param UserPaymentReceived $event
     *
     * @return void
     */
    public function handle(UserPaymentReceived $event): void
    {
        // $gamp = GAMP::setClientId($event->payment->user_id);
        // $gamp
        //     ->setEventAction('Purchase')
        //     ->setUserId($event->payment->user_id)
        //     ->setEmail($event->payment->email)
        //     ->setAmount($event->payment->amount)
        //     ->setTariff($event->payment->tariff_id)
        //     ->setIsRecurrent($event->payment->user->recurring_subscription);
    }
}
