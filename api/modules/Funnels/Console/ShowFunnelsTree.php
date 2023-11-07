<?php

namespace Modules\Funnels\Console;

use App\Entities\Task;
use Illuminate\Console\Command;
use Modules\Funnels\Entities\Funnel;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Entities\Trigger;
use Modules\Funnels\Enums\TriggerActionType;

final class ShowFunnelsTree extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sober:funnels:tree';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Print funnel stages and tasks tree';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $funnel_name = $this->choice(
            'Select funnel',
            Funnel::all()->pluck('title')->toArray(),
            '0'
        );

        /** @var Funnel $funnel */
        $funnel = Funnel::where('title', $funnel_name)->firstOrFail();

        $funnel->stages->each(function (FunnelStage $stage): void {
            $this->info("> {$stage->title}");
            $stage->triggers->each(function (Trigger $trigger): void {
                foreach ($trigger->actions as $action) {
                    if (\data_get($action, 'type') === TriggerActionType::assignTasks()->value) {
                        $ids = \data_get($action, 'payload.ids');
                        if ($ids) {
                            $tasks = Task::whereIn('id', $ids)->get();
                            $tasks->each(function (Task $task): void {
                                $this->line("\t{$task->title}");
                            });
                        }
                    }
                }
            });
        });

        return 0;
    }
}
