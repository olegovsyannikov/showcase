<?php

namespace Modules\Funnels\Console;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Modules\Accounting\Entities\User;

final class CheckUsersState extends Command
{
    protected const CACHE_KEY = 'checked-users';
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'sober:funnels:check-users-state';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check users state in funnels.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        \info('Start checking users funnels state');

        User::where('last_activity_at', '>', Carbon::now('UTC')->subDays(1))
            ->where('is_deleted', false)
            ->whereHas('activeStages')
            ->chunk(10, function ($users): void {
                foreach ($users as $user) {
                    \dispatch(function () use ($user): void {
                        $user->checkState();
                    });
                }
            });

        \info('Finish checking users funnels state');
    }
}
