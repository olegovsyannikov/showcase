<?php

namespace Modules\Funnels\Jobs;

use Illuminate\Support\Facades\Log;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\FunnelStage;

final class CompleteFunnelStageJob extends AbstractActionJob
{
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
        Log::debug("Complete stage id#{$this->funnelStage->id} by user id#{$this->user->id}");
        $this->funnelStage->activeUsers()->updateExistingPivot($this->user->id, [
            'completed_at' => \now(),
        ]);
    }
}
