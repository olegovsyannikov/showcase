<?php

namespace Modules\Funnels\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Enums\TriggerActionType;

/**
 * Modules\Funnels\Entities\FunnelStage.
 *
 * @property int                                                                          $id
 * @property int                                                                          $funnel_id
 * @property string                                                                       $title
 * @property int                                                                          $position
 * @property string|null                                                                  $description
 * @property \Carbon\Carbon|null                                                          $created_at
 * @property \Carbon\Carbon|null                                                          $updated_at
 * @property \Illuminate\Database\Eloquent\Collection|User[]                              $activeUsers
 * @property int|null                                                                     $active_users_count
 * @property \Modules\Funnels\Entities\Funnel                                             $funnel
 * @property string                                                                       $cache_key_triggers
 * @property array                                                                        $task_ids
 * @property \Illuminate\Database\Eloquent\Collection|\Modules\Funnels\Entities\Trigger[] $triggers
 * @property int|null                                                                     $triggers_count
 * @property \Illuminate\Database\Eloquent\Collection|User[]                              $users
 * @property int|null                                                                     $users_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder|FunnelStage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FunnelStage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FunnelStage query()
 * @mixin \Eloquent
 */
final class FunnelStage extends Model
{
    protected $table = 'funnel_stages';

    protected $fillable = ['title', 'funnel_id', 'position', 'description'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function funnel(): BelongsTo
    {
        return $this->belongsTo(Funnel::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot(['completed_at', 'is_active']);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function activeUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->wherePivot('is_active', true)
            ->wherePivotNull('completed_at');
    }

    /**
     * @param User $user
     *
     * @return bool
     */
    public function hasUser(User $user): bool
    {
        return $this->users()->where('user_id', $user->id)->exists();
    }

    /**
     * @param User $user
     *
     * @return bool
     */
    public function hasActiveUser(User $user): bool
    {
        return $this->activeUsers()->where('user_id', $user->id)->exists();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function triggers(): BelongsToMany
    {
        return $this->belongsToMany(Trigger::class);
    }

    /**
     * @return string
     */
    public function getCacheKeyTriggersAttribute(): string
    {
        return "stage{$this->id}_triggers";
    }

    /**
     * @return array
     */
    public function getTaskIdsAttribute(): array
    {
        return $this
            ->triggers()
            ->where('actions->type', TriggerActionType::assignTasks()->value)
            ->get()
            ->reduce(function (array $carry, Trigger $trigger) {
                return \array_merge(
                    $carry,
                    \data_get($trigger, 'actions.payload.ids', []),
                );
            }, []);
    }
}
