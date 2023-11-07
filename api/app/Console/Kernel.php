<?php

namespace App\Console;

use App\Console\Commands\FixTasksUsersDuplicates;
use App\Console\Commands\SendDiaryNotifications;
use Illuminate\Auth\Console\ClearResetsCommand;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Modules\Funnels\Console\CheckUsersState;
use Modules\Funnels\Console\ExecuteDelayedActions;
use Spatie\Backup\Commands\BackupCommand;

final class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param \Illuminate\Console\Scheduling\Schedule $schedule
     *
     * @return void
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command(CheckUsersState::class)
            ->everyThreeHours()
            ->withoutOverlapping()
            ->onOneServer()
            ->environments(['staging', 'production'])
            ->runInBackground();

        $schedule->command(FixTasksUsersDuplicates::class)
            ->everySixHours()
            ->withoutOverlapping()
            ->onOneServer()
            ->environments(['staging', 'production'])
            ->runInBackground();

        // $schedule->command(SendDiaryNotifications::class)
        //     ->everyFifteenMinutes()
        //     ->withoutOverlapping()
        //     ->onOneServer()
        //     ->environments(['production'])
        //     ->runInBackground();

        // $schedule->command(BackupCommand::class, ['--only-db'])
        //     ->hourlyAt(30)
        //     ->withoutOverlapping()
        //     ->onOneServer()
        //     ->environments(['production'])
        //     ->runInBackground();

        $schedule->command(ExecuteDelayedActions::class)
            ->everyMinute()
            ->withoutOverlapping()
            ->onOneServer()
            ->runInBackground();

        $schedule->command(ClearResetsCommand::class)
            ->everyFifteenMinutes()
            ->onOneServer()
            ->runInBackground();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require \base_path('routes/console.php');
    }
}
