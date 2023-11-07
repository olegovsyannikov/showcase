<?php

namespace Modules\Funnels\Entities;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use InvalidArgumentException;
use Modules\Accounting\Entities\User;

final class TriggerUserAction extends Model
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'trigger_user_actions';

    /**
     * {@inheritdoc}
     */
    protected $fillable = ['type', 'user_id', 'trigger_id', 'status', 'created_at', 'updated_at'];

    /**
     * @return BelongsTo
     */
    public function trigger(): BelongsTo
    {
        return $this->belongsTo(Trigger::class);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @param Builder $query
     * @param int     $userId
     *
     * @return Builder
     *
     * @throws InvalidArgumentException
     */
    public function scopeOfUserId(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * @param Builder $query
     * @param int     $triggerId
     *
     * @return Builder
     *
     * @throws InvalidArgumentException
     */
    public function scopeOfTriggerId(Builder $query, int $triggerId): Builder
    {
        return $query->where('trigger_id', $triggerId);
    }

    /**
     * @param Builder $query
     * @param string  $type
     *
     * @return Builder
     *
     * @throws InvalidArgumentException
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }
}
