<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Modules\Accounting\Entities\User;
use RuntimeException;

/**
 * App\Entities\Task.
 *
 * @property int                                                                      $id
 * @property int                                                                      $position
 * @property int                                                                      $type
 * @property int                                                                      $stage
 * @property string|null                                                              $image
 * @property string                                                                   $title
 * @property string|null                                                              $announce
 * @property string|null                                                              $text
 * @property string|null                                                              $time_to_do
 * @property string|null                                                              $response
 * @property int                                                                      $is_active
 * @property int                                                                      $is_reccurent
 * @property int|null                                                                 $reccurent_frequency
 * @property int                                                                      $availability
 * @property string|null                                                              $response_form_title
 * @property string|null                                                              $response_form_text
 * @property string|null                                                              $intro
 * @property int|null                                                                 $set_stage
 * @property int|null                                                                 $delay_after_previous_task
 * @property int|null                                                                 $delay_after_all_tasks
 * @property int                                                                      $consider_in_uncompleted
 * @property int                                                                      $is_deleted
 * @property int|null                                                                 $show_other_answers
 * @property string|null                                                              $wait_for_time
 * @property int|null                                                                 $send_to_intercom
 * @property int|null                                                                 $material_id
 * @property mixed                                                                    $material_meta
 * @property string|null                                                              $material_text
 * @property string|null                                                              $test_description
 * @property int|null                                                                 $test_id
 * @property string|null                                                              $test_title
 * @property string|null                                                              $test_typeform_id
 * @property \Illuminate\Database\Eloquent\Collection|\App\Entities\TaskItem[]        $items
 * @property int|null                                                                 $items_count
 * @property \App\Entities\Material|null                                              $material
 * @property \Illuminate\Database\Eloquent\Collection|\Modules\Funnels\Entities\Tag[] $tags
 * @property int|null                                                                 $tags_count
 * @property \App\Entities\Test|null                                                  $test
 * @property \Illuminate\Database\Eloquent\Collection|User[]                          $users
 * @property int|null                                                                 $users_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Task query()
 * @mixin \Eloquent
 */
final class Task extends BaseModel
{
    public const FOR_FREE = 1;
    public const FOR_PAID = 2;
    public const FOR_ALL = 3;

    protected $table = 'tasks';

    /**
     * @return MorphMany
     */
    public function tags(): MorphMany
    {
        return $this->morphMany('Modules\Funnels\Entities\Tag', 'taggable');
    }

    /**
     * @return HasOne
     */
    public function material(): HasOne
    {
        return $this->hasOne(Material::class);
    }

    /**
     * @return HasOne
     */
    public function test(): HasOne
    {
        return $this->hasOne(Test::class);
    }

    /**
     * @return HasMany
     * @psalm-suppress InvalidReturnType
     */
    public function items(): HasMany
    {
        /*
         * @psalm-suppress all
         */
        return $this
            ->hasMany(TaskItem::class)
            ->where('is_active', 1)
            ->orderBy('position');
    }

    /**
     * @return string|null
     */
    public function getMaterialTextAttribute(): ?string
    {
        return $this->material ? $this->material->text : '';
    }

    /**
     * @return mixed
     */
    public function getMaterialMetaAttribute()
    {
        return $this->material ? \json_decode((string) $this->material->meta, true) : '';
    }

    /**
     * @return int|null
     */
    public function getMaterialIdAttribute()
    {
        return $this->material ? $this->material->id : null;
    }

    /**
     * @return int|null
     */
    public function getTestIdAttribute()
    {
        return $this->test ? $this->test->id : null;
    }

    /**
     * @return string|null
     */
    public function getTestDescriptionAttribute()
    {
        return $this->test ? $this->test->description : '';
    }

    /**
     * @return string|null
     */
    public function getTestTitleAttribute()
    {
        return $this->test ? $this->test->title : '';
    }

    /**
     * @return string|null
     */
    public function getTestTypeformIdAttribute(): ?string
    {
        return $this->test ? $this->test->typeform_form_id : '';
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'tasks_users');
    }

    /**
     * @param Builder $query
     * @param User    $user
     *
     * @return Builder
     *
     * @throws RuntimeException
     */
    public function scopeNotAssignTo(Builder $query, User $user): Builder
    {
        return $query->whereDoesntHave('users', function (Builder $query) use ($user): void {
            $query->where('user_id', $user->id);
        });
    }

    /**
     * @param User $user
     *
     * @return string
     */
    public function formatUserAnswers(User $user): string
    {
        /** @var TaskResult|null $taskResult */
        $taskResult = $user
            ->tasksResults()
            ->where('task_id', $this->id)
            ->whereNotNull('finished_at')
            ->orderBy('finished_at', 'desc')
            ->first();

        if ($taskResult && $taskResult->is_finished && $taskResult->result) {
            $body1 = "<h2>\"{$this->title}\" (ответ на задание)</h2>";
            $body2 = [];

            foreach (\json_decode($taskResult->result, true) as $taskItemId => $answerText) {
                if (!$taskItem = TaskItem::find($taskItemId)) {
                    $body2[] = $answerText;
                } elseif (\is_array($answerText)) {
                    $itemData = \json_decode($taskItem->text);

                    // json checkboxes
                    if ($itemData && $itemData->type === 'checkbox' && isset($itemData->options)) {
                        $options = $itemData->options;
                        $intercomAnswerText = '';
                        foreach ($answerText as $i => $itemAnswer) {
                            if ($itemAnswer) {
                                $intercomAnswerText .= ($options[$i]->label . ";\n");
                            }
                        }

                        $body2[] = "<h3>{$taskItem->title}</h3><p>{$intercomAnswerText}</p>";
                    }
                } else {
                    $body2[] = "<h3>{$taskItem->title}</h3><p>{$answerText}</p>";
                }
            }

            if (!$body2) {
                return '';
            }

            return $body1 . \implode('', $body2);
        }

        return '';
    }
}
