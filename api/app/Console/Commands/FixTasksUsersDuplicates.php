<?php

namespace App\Console\Commands;

use App\Entities\UserTask;
use Illuminate\Console\Command;
use Illuminate\Database\Connection;

final class FixTasksUsersDuplicates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sober:users:fix-tasks-duplicates {--i|interactive}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove duplicated tasks';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle(Connection $connection)
    {
        $result_items = \collect();

        $connection
            ->table((new UserTask())->getTable())
            ->select(['user_id', 'task_id'])
            ->groupBy('user_id', 'task_id')
            ->havingRaw('count(*) > 1')
            ->orderBy('user_id')
            ->chunk(25, function ($items) use (&$result_items, $connection): void {
                $items_to_del = $items->reduce(function ($carry, $user_task) use ($connection) {
                    $items = $connection
                        ->table((new UserTask())->getTable())
                        ->where([
                            ['user_id', $user_task->user_id],
                            ['task_id', $user_task->task_id],
                        ])
                        ->orderBy('task_result_id', 'desc')
                        ->oldest()
                        ->orderByRaw('seen_at is null')
                        ->orderBy('seen_at')
                        ->get();

                    $items->shift();

                    return $carry->merge($items);
                }, \collect());

                if ($this->option('interactive')) {
                    $this->info('Going to del IDs:');
                    $this->table(
                        ['id', 'created_at', 'task_result_id', 'seen_at'],
                        $items_to_del->map(fn ($i) => [$i->id, $i->created_at, $i->task_result_id, $i->seen_at])
                    );

                    if ($this->confirm('Delete them?')) {
                        $result_items = $result_items->concat($items_to_del->toArray());
                    }

                    $this->line(\str_repeat('-', 80));
                } else {
                    $result_items = $result_items->concat($items_to_del->toArray());
                }
            });

        $connection
            ->table((new UserTask())->getTable())
            ->whereIn('id', $result_items->pluck('id')->toArray())
            ->delete();
    }
}
