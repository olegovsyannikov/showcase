<?php

namespace App\Providers;

use App\Events\UserBecomePaidEvent;
use App\Events\UserCompleteTaskEvent;
use App\Events\UserCreatedEvent;
use App\Events\UserLoggedEvent;
use App\Events\UserPaymentReceived;
use App\Events\UserRegisteredEvent;
use App\Listeners\ClearDiaryReminders;
use App\Listeners\SendRevenueToGTM;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Modules\Accounting\Listeners\SetupUserRole;
use Modules\Funnels\Events\UserEnterFunnelStageEvent;
use Modules\Funnels\Listeners\AssignFunnelStageTasks;
use Modules\Funnels\Listeners\CheckNewTasks;
use Modules\Funnels\Listeners\InitUserFunnels;
use Modules\Funnels\Listeners\InitUserPaidFunnels;
use Modules\Funnels\Listeners\ReactToThePayment;
use Modules\Funnels\Listeners\SendResultsToIntercom;
use SocialiteProviders\Google\GoogleExtendSocialite;
use SocialiteProviders\Manager\SocialiteWasCalled;

final class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        UserRegisteredEvent::class => [
            SetupUserRole::class,
            InitUserFunnels::class,
        ],

        UserCreatedEvent::class => [
            SetupUserRole::class,
            InitUserFunnels::class,
        ],

        UserLoggedEvent::class => [
            ClearDiaryReminders::class,
        ],

        UserCompleteTaskEvent::class => [
            CheckNewTasks::class,
            SendResultsToIntercom::class,
        ],

        UserEnterFunnelStageEvent::class => [
            AssignFunnelStageTasks::class,
        ],

        UserBecomePaidEvent::class => [
            InitUserPaidFunnels::class,
        ],

        UserPaymentReceived::class => [
            SendRevenueToGTM::class,
            ReactToThePayment::class,
        ],

        SocialiteWasCalled::class => [
            GoogleExtendSocialite::class,
        ],
    ];
}
