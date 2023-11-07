<?php

namespace Modules\Funnels\Jobs;

use Illuminate\Support\Facades\DB;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Events\UserEnterFunnelStageEvent;

final class AddUserToFunnelStageJob extends AbstractActionJob
{
    /**
     * @var User
     */
    protected User $user;

    /**
     * @var FunnelStage
     */
    protected FunnelStage $funnelStage;

    /**
     * @param User        $user
     * @param FunnelStage $funnelStage
     */
    public function __construct(User $user, FunnelStage $funnelStage)
    {
        $this->user = $user;
        $this->funnelStage = $funnelStage;
    }

    /**
     * {@inheritdoc}
     */
    public function run(): void
    {
        DB::transaction(function (): void {
            $this->user->stages()->syncWithoutDetaching([
                $this->funnelStage->id => [
                    'is_active' => true,
                ],
            ]);
        }, 3);

        \event(new UserEnterFunnelStageEvent(
            $this->user,
            $this->funnelStage
        ));
    }
}
