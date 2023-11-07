<?php

namespace App\Entities;

/**
 * App\Entities\TaskItem.
 *
 * @property int                $id
 * @property int                $task_id
 * @property int|null           $position
 * @property int                $type
 * @property string|null        $image
 * @property string             $title
 * @property string|null        $text
 * @property int                $is_active
 * @property \App\Entities\Task $task
 *
 * @method static \Illuminate\Database\Eloquent\Builder|TaskItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaskItem query()
 * @mixin \Eloquent
 */
final class TaskItem extends BaseModel
{
    protected $table = 'tasks_items';

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
