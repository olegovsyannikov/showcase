<?php

namespace App\Events;

use App\Entities\Task;
use App\Entities\UserTask;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Modules\Accounting\Entities\User;

final class UserCompleteTaskEvent
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var User
     */
    public User $user;

    /**
     * @var Task
     */
    public Task $task;

    /**
     * @var UserTask|null
     */
    public ?UserTask $userTask = null;

    /**
     * @param int $userId
     * @param int $taskId
     *
     * @return void
     */
    public function __construct(int $userId, int $taskId)
    {
        $this->user = User::findOrFail($userId);
        $this->task = Task::findOrFail($taskId);

        $this->userTask = UserTask::where([
            ['user_id', '=', $userId],
            ['task_id', '=', $taskId],
        ])->first();
    }
}
