<?php

namespace Modules\Funnels\Entities;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Services\Triggers\Actions\ActionInterface;

/**
 * Modules\Funnels\Entities\Trigger.
 *
 * @property int                                                                              $id
 * @property array                                                                            $condition
 * @property array                                                                            $actions
 * @property \Carbon\Carbon|null                                                              $created_at
 * @property \Carbon\Carbon|null                                                              $updated_at
 * @property int                                                                              $position
 * @property int                                                                              $max_executions
 * @property \Illuminate\Database\Eloquent\Collection|\Modules\Funnels\Entities\Funnel[]      $funnels
 * @property int|null                                                                         $funnels_count
 * @property \Illuminate\Database\Eloquent\Collection|\Modules\Funnels\Entities\FunnelStage[] $stages
 * @property int|null                                                                         $stages_count
 * @property \Illuminate\Database\Eloquent\Collection|User[]                                  $users
 * @property int|null                                                                         $users_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Trigger newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Trigger newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Trigger query()
 * @mixin \Eloquent
 */
final class Trigger extends Model
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'triggers';

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'condition',
        'actions',
        'position',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'condition' => 'array',
        'actions' => 'array',
    ];

    protected static function booted(): void
    {
        static::deleting(function (self $trigger): void {
            $trigger->stages()->detach();
            $trigger->funnels()->detach();
        });
    }

    /**
     * @return BelongsToMany
     */
    public function stages(): BelongsToMany
    {
        return $this->belongsToMany(FunnelStage::class);
    }

    /**
     * @return BelongsToMany
     */
    public function funnels(): BelongsToMany
    {
        return $this->belongsToMany(Funnel::class);
    }

    /**
     * @return BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this
            ->belongsToMany(User::class)
            ->withTimestamps();
    }

    /**
     * @param User $user
     *
     * @return bool
     */
    public function isCompletedBy(User $user): bool
    {
        return TriggerUserAction::where('status', '<>', ActionInterface::STATUS_OK)
            ->ofUserId($user->id)
            ->ofTriggerId($this->id)
            ->count() === 0;
    }

    /**
     * @param User $user
     *
     * @return void
     */
    public function tryToComplete(User $user): void
    {
        if ($this->isCompletedBy($user)) {
            $this->users()->updateExistingPivot($user->id, [
                'completed_at' => Carbon::now(),
            ]);
        }
    }
}
