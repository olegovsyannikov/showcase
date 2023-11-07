<?php

namespace Modules\Funnels\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Modules\Funnels\Entities\Funnel;
use Modules\Funnels\Jobs\AddUserToFunnelStageJob;

final class InitUserPaidFunnels implements ShouldQueue
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
        if ($event->isInitial) {
            Log::debug("Add user id#{$event->user->id} to paid funnel id#2");
            $funnel_stage1 = Funnel::findOrFail(2)->stages()->where('position', 1)->firstOrFail();
            \dispatch_sync(new AddUserToFunnelStageJob($event->user, $funnel_stage1));
            $event->user->checkState();
        }
    }
}
