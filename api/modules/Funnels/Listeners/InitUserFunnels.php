<?php

namespace Modules\Funnels\Listeners;

use App\Events\UserCreatedEvent;
use App\Events\UserRegisteredEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Modules\Funnels\Entities\Funnel;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Jobs\AddUserToFunnelStageJob;

final class InitUserFunnels implements ShouldQueue
{
    /**
     * Handle the event.
     *
     * @param object $event
     *
     * @return void
     */
    public function handle($event): void
    {
        if (
            $event instanceof UserRegisteredEvent
            || $event instanceof UserCreatedEvent
        ) {
            $user = $event->getUser();
            Log::debug("Add user {$user->id} to default funnel");

            /** @var FunnelStage $mainFunnelStage */
            $mainFunnelStage = Funnel::whereIsDefault(1)
                ->firstOrFail()
                ->stages()
                ->where('position', 1)
                ->firstOrFail();

            \dispatch(new AddUserToFunnelStageJob($user, $mainFunnelStage))->delay(1);
        }
    }
}
