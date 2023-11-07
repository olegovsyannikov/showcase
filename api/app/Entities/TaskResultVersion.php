<?php

namespace App\Entities;

use Carbon\Carbon;
use Modules\Accounting\Entities\User;

/**
 * App\Entities\TaskResultVersion.
 *
 * @property int                      $id
 * @property int                      $task_id
 * @property int                      $user_id
 * @property \Carbon\Carbon           $created_at
 * @property \Carbon\Carbon|null      $updated_at
 * @property int                      $is_finished
 * @property string|null              $result
 * @property \Carbon\Carbon|null      $finished_at
 * @property int                      $task_result_id
 * @property \Carbon\Carbon           $version_created_at
 * @property \App\Entities\Task       $task
 * @property \App\Entities\TaskResult $taskResult
 * @property User                     $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|TaskResultVersion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskResultVersion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskResultVersion query()
 * @mixin \Eloquent
 */
final class TaskResultVersion extends BaseModel
{
    protected $table = 'tasks_results_versions';
    protected $dates = ['created_at', 'updated_at', 'finished_at', 'version_created_at'];
    protected $guarded = [];

    /**
     * @param TaskResult $taskResult
     *
     * @return TaskResultVersion
     */
    public static function createNewVersion(TaskResult $taskResult)
    {
        $v = new static();
        $v->task_id = $taskResult->task_id;
        $v->user_id = $taskResult->user_id;
        $v->created_at = $taskResult->created_at;
        $v->updated_at = $taskResult->updated_at;
        $v->is_finished = $taskResult->is_finished;
        $v->result = $taskResult->result;
        $v->finished_at = $taskResult->finished_at;
        $v->task_result_id = $taskResult->id;
        $v->version_created_at = Carbon::now('UTC');

        $v->saveOrFail();

        return $v;
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function taskResult()
    {
        return $this->belongsTo(TaskResult::class);
    }
}
