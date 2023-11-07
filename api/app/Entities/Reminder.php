<?php

namespace App\Entities;

use App\Enums\ReminderTypeEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Accounting\Entities\User;

/**
 * App\Entities\Reminder.
 *
 * @property int                 $id
 * @property int                 $user_id
 * @property ReminderTypeEnum    $type
 * @property string              $title
 * @property string              $body
 * @property int                 $is_seen
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property User                $user
 *
 * @method static Builder|Reminder newModelQuery()
 * @method static Builder|Reminder newQuery()
 * @method static Builder|Reminder ofType(\App\Enums\ReminderTypeEnum $type)
 * @method static Builder|Reminder query()
 * @mixin \Eloquent
 */
final class Reminder extends Model
{
    protected $table = 'reminders';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'body',
        'is_seen',
    ];

    protected $casts = [
        'type' => ReminderTypeEnum::class,
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @param Builder          $query
     * @param ReminderTypeEnum $type
     *
     * @return Builder
     */
    public function scopeOfType(Builder $query, ReminderTypeEnum $type): Builder
    {
        return $query->whereEnum('type', $type);
    }
}
