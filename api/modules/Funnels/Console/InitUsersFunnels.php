<?php

namespace Modules\Funnels\Console;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\Funnel;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Jobs\AddUserToFunnelStageJob;

final class InitUsersFunnels extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'sober:funnels:init-users-funnels';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Put users with no funnels to the default funnel.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        \info('Started initializing users funnels.');

        User::where('last_activity_at', '>', Carbon::now('UTC')->subDays(30))
        ->where('is_deleted', false)
        ->doesntHave('stages')
        ->chunk(10, function ($users): void {
            /** @var FunnelStage $mainFunnelStage */
            $mainFunnelStage = Funnel::whereIsDefault(1)
                ->firstOrFail()
                ->stages()
                ->where('position', 1)
                ->firstOrFail();

            foreach ($users as $user) {
                \Log::debug("Add user {$user->id} to default funnel");
                \dispatch(new AddUserToFunnelStageJob($user, $mainFunnelStage))->delay(1);
            }
        });

        \info('Finished initializing users funnels');
    }
}
