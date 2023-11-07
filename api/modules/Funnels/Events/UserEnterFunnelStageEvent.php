<?php

namespace Modules\Funnels\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\FunnelStage;

final class UserEnterFunnelStageEvent
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var User
     */
    public User $user;

    /**
     * @var FunnelStage
     */
    public FunnelStage $funnelStage;

    /**
     * @param User        $user
     * @param FunnelStage $funnelStage
     *
     * @return void
     */
    public function __construct(User $user, FunnelStage $funnelStage)
    {
        $this->user = $user;
        $this->funnelStage = $funnelStage;
    }
}
