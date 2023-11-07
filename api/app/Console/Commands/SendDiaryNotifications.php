<?php

namespace App\Console\Commands;

use App\Enums\ReminderTypeEnum;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;
use InvalidArgumentException;
use Modules\Accounting\Entities\User;
use Modules\Diary\Notifications\Reminder;

final class SendDiaryNotifications extends Command
{
    /**
     * Remind user after days.
     */
    public const REMIND_AFTER_DAYS = 3;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sober:diary:notify';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send diary notifications';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        User::has('activeStages')
            ->whereHas('reminders', function (Builder $query): void {
                $query->where('type', ReminderTypeEnum::diary()->value);
            }, '<', 3)
            ->whereDoesntHave('reminders', function (Builder $query): void {
                $query->where('created_at', '>', \now()->subDays(self::REMIND_AFTER_DAYS));
            })
            ->where('is_deleted', 0)
            ->where('notify_diary', 1)
            ->where('last_activity_at', '<=', \now('UTC')->subDays(self::REMIND_AFTER_DAYS))
            ->chunk(100, function ($users): void {
                $users
                    ->filter(function (User $user) {
                        $notify_diary_time = Carbon::createFromTimeString(
                            $user->notify_diary_time,
                            $user->tz
                        );

                        return $notify_diary_time <= \now($user->tz);
                    })
                    ->each(function (User $user): void {
                        try {
                            $reminder = new Reminder($user->language);
                            $user->notify($reminder);
                            $user->reminders()->create([
                                'type' => ReminderTypeEnum::diary(),
                                'title' => $reminder->title,
                                'body' => $reminder->body,
                            ]);
                        } catch (InvalidArgumentException $e) {
                            // pass
                        }
                    });
            });
    }
}
