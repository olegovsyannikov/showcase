<?php

namespace Modules\Funnels\Jobs;

use App\Entities\Task;
use Illuminate\Support\Facades\Log;
use Modules\Accounting\Entities\User;
use phpcent\Client;

final class AssignTasksJob extends AbstractActionJob
{
    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * @var User
     */
    protected $user;

    /**
     * @var array
     */
    protected $tasks;

    /**
     * @var int
     */
    protected $funnelStageId;

    /**
     * @var int
     */
    protected $triggerId;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(User $user, array $tasks, int $funnelStageId, int $triggerId)
    {
        $this->user = $user;
        $this->tasks = $tasks;
        $this->funnelStageId = $funnelStageId;
        $this->triggerId = $triggerId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function run(): void
    {
        $centClient = \resolve(Client::class);

        Log::debug(\sprintf(
            "Assign tasks %s to user id#{$this->user->id}",
            \implode(',', $this->tasks)
        ));

        $notAssignedTasks = Task::whereIn('id', $this->tasks)
            ->notAssignTo($this->user)
            ->pluck('id');

        $tasksWithParams = \collect($notAssignedTasks)->mapWithKeys(function ($taskId) {
            return [$taskId => [
                'funnel_stage_id' => $this->funnelStageId,
                'trigger_id' => $this->triggerId,
            ]];
        });
        $this->user->originalTasks()->syncWithoutDetaching($tasksWithParams);

        $centClient->publish("tasks#{$this->user->id}", ['success' => true]);
    }
}
