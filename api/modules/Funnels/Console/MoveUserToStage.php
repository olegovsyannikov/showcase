<?php

namespace Modules\Funnels\Console;

use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\Funnel;
use Modules\Funnels\Jobs\AddUserToFunnelStageJob;
use Modules\Funnels\Jobs\CompleteFunnelStageJob;
use Symfony\Component\Console\Input\InputArgument;

final class MoveUserToStage extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'sober:funnels:move-user-to-stage';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Move user to stage with position.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {
            $user = User::findOrFail($this->argument('user'));
        } catch (ModelNotFoundException $e) {
            $user = User::where('email', $this->argument('user'))->firstOrFail();
        }

        $funnel_name = $this->choice(
            'Select funnel',
            Funnel::all()->pluck('title')->toArray(),
            '0'
        );
        $funnel = Funnel::where('title', $funnel_name)->firstOrFail();

        $funnel_stage_name = $this->choice(
            'Select stage',
            $funnel->stages()->orderBy('position')->get()->pluck('title')->toArray(),
            '0'
        );
        $funnel_stage = $funnel->stages()->where('title', $funnel_stage_name)->firstOrFail();

        if ($this->confirm('Do you wish to continue?')) {
            foreach ($user->stages()->where('funnel_id', $funnel->id)->cursor() as $stage) {
                if ($stage->id !== $funnel_stage->id) {
                    \dispatch_sync(new CompleteFunnelStageJob($user, $stage));
                }
            }

            \dispatch_sync(new AddUserToFunnelStageJob($user, $funnel_stage));
        }
    }

    /**
     * Get the console command arguments.
     *
     * @return array
     */
    protected function getArguments()
    {
        return [
            ['user', InputArgument::REQUIRED, 'User ID or email.'],
        ];
    }
}
