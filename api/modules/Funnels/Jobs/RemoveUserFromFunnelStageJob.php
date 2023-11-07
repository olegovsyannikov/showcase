<?php

namespace Modules\Funnels\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\FunnelStage;

final class RemoveUserFromFunnelStageJob extends AbstractActionJob
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @var User
     */
    protected $user;

    /**
     * @var FunnelStage
     */
    protected $funnelStage;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user, FunnelStage $funnel_stage)
    {
        $this->user = $user;
        $this->funnelStage = $funnel_stage;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function run(): void
    {
        $this->funnelStage->activeUsers()->updateExistingPivot($this->user->id, [
            'is_active' => false,
        ]);
    }
}
