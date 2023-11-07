<?php

namespace App\Entities;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Notifications\Notifiable;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Entities\Trigger;

/**
 * App\Entities\UserTask.
 *
 * @property int                                                                                                       $id
 * @property int                                                                                                       $task_id
 * @property int                                                                                                       $user_id
 * @property int|null                                                                                                  $task_result_id
 * @property \Carbon\Carbon                                                                                            $created_at
 * @property \Carbon\Carbon|null                                                                                       $seen_at
 * @property \Carbon\Carbon|null                                                                                       $postponed_until
 * @property int|null                                                                                                  $show_my_answers
 * @property string|null                                                                                               $intercom_conversation_id
 * @property \Carbon\Carbon|null                                                                                       $notified_at
 * @property int|null                                                                                                  $is_favorite
 * @property int|null                                                                                                  $funnel_stage_id
 * @property int|null                                                                                                  $trigger_id
 * @property string                                                                                                    $status
 * @property \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property int|null                                                                                                  $notifications_count
 * @property FunnelStage|null                                                                                          $stage
 * @property \App\Entities\Task                                                                                        $task
 * @property \App\Entities\TaskResult|null                                                                             $taskResult
 * @property Trigger|null                                                                                              $trigger
 * @property User                                                                                                      $user
 *
 * @method static Builder|UserTask finished()
 * @method static Builder|UserTask newModelQuery()
 * @method static Builder|UserTask newQuery()
 * @method static Builder|UserTask query()
 * @mixin \Eloquent
 */
final class UserTask extends BaseModel
{
    use Notifiable;

    protected $table = 'tasks_users';

    protected $guarded = ['id'];

    protected $dates = [
        'created_at',
        'seen_at',
        'postponed_until',
        'notified_at',
    ];

    /**
     * @param int $taskId
     * @param int $userId
     *
     * @return mixed
     */
    public static function getByTaskId(int $taskId, int $userId)
    {
        return static::where('task_id', $taskId)
            ->where('user_id', $userId)
            ->firstOrFail();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function taskResult()
    {
        return $this->belongsTo(TaskResult::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function stage()
    {
        return $this->belongsTo(FunnelStage::class, 'funnel_stage_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function trigger()
    {
        return $this->belongsTo(Trigger::class);
    }

    /**
     * @return string
     */
    public function getStatusAttribute()
    {
        if (!$this->isSeen()) {
            return 'new';
        }

        if (!$this->isStarted()) {
            return 'seen';
        }

        if ($this->isPostponed()) {
            return 'postponed';
        }

        if (!$this->isFinished()) {
            return 'in_progress';
        }

        return 'finished';
    }

    /**
     * @throws \Throwable
     */
    public function seen(): void
    {
        if ($this->seen_at) {
            return;
        }

        $this->seen_at = Carbon::now('UTC');
        $this->saveOrFail();

        if ($this->task->material_id) {
            $isMaterialExists = MaterialUser::where('material_id', $this->task->material_id)
                ->where('user_id', $this->user_id)
                ->exists();

            if ($isMaterialExists === false) {
                $userMaterial = new MaterialUser();
                $userMaterial->material_id = $this->task->material_id;
                $userMaterial->user_id = $this->user_id;
                $userMaterial->first_seen_time = $this->seen_at;
                $userMaterial->saveOrFail();
            }
        }
    }

    /**
     * @return bool
     */
    public function isActive()
    {
        return (bool) $this->task->is_active;
    }

    /**
     * @return bool
     */
    public function isStarted()
    {
        try {
            $this->taskResult()->firstOrFail();
        } catch (\Exception $e) {
            return false;
        }

        return true;
    }

    /**
     * @return bool
     */
    public function isFinished()
    {
        if ($this->isStarted() && $this->taskResult) {
            return (bool) $this->taskResult->is_finished;
        }

        return false;
    }

    /**
     * @return bool
     */
    public function isEditable()
    {
        return true;
    }

    /**
     * @return bool
     */
    public function isSeen()
    {
        return $this->seen_at !== null;
    }

    /**
     * @return bool
     */
    public function isPostponed()
    {
        if ($this->postponed_until) {
            return $this->postponed_until->greaterThan(Carbon::now('UTC'));
        }

        return false;
    }

    /**
     * @return UserTask
     *
     * @throws \Throwable
     */
    public function beginTask()
    {
        /** @var TaskResult $result */
        $result = $this->taskResult()->firstOrCreate(['task_id' => $this->task_id], [
            'user_id' => $this->user_id,
            'is_finished' => false,
            'result' => '',
            'created_at' => Carbon::now('UTC'),
        ]);

        $this->task_result_id = $result->id;
        $this->saveOrFail();

        return $this;
    }

    /**
     * @param string $result
     *
     * @return TaskResult
     *
     * @throws \Throwable
     */
    public function endTask(string $result = '')
    {
        /** @var TaskResult $taskResult */
        $taskResult = $this->taskResult()->firstOrNew(['task_id' => $this->task_id], [
            'user_id' => $this->user_id,
            'created_at' => Carbon::now('UTC'),
        ]);

        $taskResult->is_finished = 1;
        $taskResult->finished_at = Carbon::now('UTC');
        $taskResult->updated_at = Carbon::now('UTC');
        $taskResult->result = $result;
        $taskResult->saveOrFail();

        $this->task_result_id = $taskResult->id;
        $this->saveOrFail();

        if ($this->task->set_stage) {
            $this->user->stage = $this->task->set_stage;
            $this->user->saveOrFail();
        }

        return $taskResult;
    }

    /**
     * @param Carbon $until
     *
     * @return UserTask
     *
     * @throws \Throwable
     */
    public function postponeTask(Carbon $until)
    {
        $this->postponed_until = $until;
        $this->saveOrFail();

        return $this;
    }

    /**
     * @param Builder $builder
     *
     * @return Builder
     */
    public function scopeFinished(Builder $builder): Builder
    {
        return $builder->whereHas('taskResult', function (Builder $builder): void {
            $builder->where('is_finished', true);
        });
    }
}
