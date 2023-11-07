<?php

namespace Modules\Funnels\Database\Seeders;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Modules\Funnels\Entities\Funnel;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Entities\Trigger;

final class TriggersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        Model::unguard();

        $this->initFree();
        $this->initPaid();
    }

    private function initFree(): void
    {
        /** @var Funnel $funnel */
        $funnel = Funnel::create([
            'title' => 'Funnel 1 (free)',
        ]);

        /** @var FunnelStage $stage1 */
        $stage1 = $funnel->stages()->create([
            'title' => 'Stage 1',
            'position' => 0,
        ]);
        $stage1->triggers()->save(Trigger::create([
            'condition' => ['type' => 'enter_funnel_stage'],
            'actions' => [
                ['type' => 'assign_tasks', 'payload' => ['ids' => [1393, 1395]]],
            ],
            'position' => 0,
        ]));
        $stage1->triggers()->save(Trigger::create([
            'condition' => ['type' => 'tasks_completed', 'payload' => ['ids' => [1393, 1395]]],
            'actions' => [
                ['type' => 'complete_stage'],
                ['type' => 'change_stage', 'payload' => ['position' => 2]],
            ],
            'position' => 1,
        ]));

        /** @var FunnelStage $stage2 */
        $stage2 = $funnel->stages()->create([
            'title' => 'Stage 2',
            'position' => 1,
        ]);
        $stage2->triggers()->save(Trigger::create([
            'condition' => ['type' => 'enter_funnel_stage'],
            'actions' => [
                ['type' => 'assign_tasks', 'payload' => ['ids' => [1398, 1422]]],
            ],
            'position' => 0,
        ]));
        $stage2->triggers()->save(Trigger::create([
            'condition' => ['type' => 'tasks_completed', 'payload' => ['ids' => [1398, 1422]]],
            'actions' => [
                ['type' => 'assign_tasks', 'payload' => ['ids' => [1402], 'delay' => 60, 'daytime_after' => '8:30']],
            ],
            'position' => 1,
        ]));
        $stage2->triggers()->save(Trigger::create([
            'condition' => ['type' => 'tasks_completed', 'payload' => ['ids' => [1402]]],
            'actions' => [
                ['type' => 'assign_tasks', 'payload' => ['ids' => [1107, 1120], 'delay' => 60, 'daytime_after' => '8:30']],
            ],
            'position' => 2,
        ]));
    }

    private function initPaid(): void
    {
        /** @var Funnel $funnel */
        $funnel = Funnel::create([
            'title' => 'Funnel 2 (paid)',
        ]);

        /** @var FunnelStage $stage1 */
        $stage1 = $funnel->stages()->create([
            'title' => 'Stage A',
            'position' => 0,
        ]);
        $stage1->triggers()->save(Trigger::create([
            'condition' => ['type' => 'enter_funnel_stage'],
            'actions' => [
                ['type' => 'assign_tasks', 'payload' => ['ids' => [1003, 1101, 1389, 1398]]],
            ],
            'position' => 0,
        ]));
        $stage1->triggers()->save(Trigger::create([
            'condition' => ['type' => 'tasks_completed', 'payload' => ['ids' => [1003, 1101, 1389, 1398]]],
            'actions' => [
                ['type' => 'assign_tasks', 'payload' => ['ids' => [1402, 1107], 'delay' => 60, 'daytime_after' => '8:30']],
            ],
            'position' => 1,
        ]));
        $stage1->triggers()->save(Trigger::create([
            'condition' => ['type' => 'tasks_completed', 'payload' => ['ids' => [1402, 1107]]],
            'actions' => [
                ['type' => 'complete_stage'],
                ['type' => 'change_stage', 'payload' => ['position' => 2]],
            ],
            'position' => 2,
        ]));

        /** @var FunnelStage $stage2 */
        $stage2 = $funnel->stages()->create([
            'title' => 'Stage B',
            'position' => 1,
        ]);
        $stage2->triggers()->save(Trigger::create([
            'condition' => ['type' => 'enter_funnel_stage'],
            'actions' => [
                ['type' => 'assign_tasks', 'payload' => ['ids' => [1201, 1327]]],
            ],
            'position' => 0,
        ]));
    }
}
