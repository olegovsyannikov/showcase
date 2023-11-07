<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Accounting\Entities\User;

/**
 * App\Entities\TaskResult.
 *
 * @property int                 $id
 * @property int                 $task_id
 * @property int                 $user_id
 * @property \Carbon\Carbon      $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property int                 $is_finished
 * @property string|null         $result
 * @property \Carbon\Carbon|null $finished_at
 * @property \App\Entities\Task  $task
 * @property User                $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|TaskResult newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskResult newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskResult query()
 * @mixin \Eloquent
 */
final class TaskResult extends BaseModel
{
    protected $table = 'tasks_results';
    protected $dates = ['created_at', 'updated_at', 'finished_at'];
    protected $guarded = [];

    /**
     * @return BelongsTo
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
