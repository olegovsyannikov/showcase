<?php

namespace Modules\Funnels\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Accounting\Entities\User;

/**
 * Modules\Funnels\Entities\ActionDelay.
 *
 * @property int                 $id
 * @property int                 $user_id
 * @property int                 $funnel_stage_id
 * @property int                 $trigger_id
 * @property string              $key_code
 * @property string              $data
 * @property string|null         $should_run_at
 * @property string|null         $processed_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property FunnelStage         $funnelStage
 * @property Trigger             $trigger
 * @property User                $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|ActionDelay newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ActionDelay newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ActionDelay query()
 * @mixin \Eloquent
 */
final class ActionDelay extends Model
{
    protected $table = 'action_delays';

    protected $fillable = [
        'user_id',
        'funnel_stage_id',
        'trigger_id',
        'key_code',
        'data',
        'should_run_at',
        'processed_at',
    ];

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo
     */
    public function funnelStage(): BelongsTo
    {
        return $this->belongsTo(FunnelStage::class);
    }

    /**
     * @return BelongsTo
     */
    public function trigger(): BelongsTo
    {
        return $this->belongsTo(Trigger::class);
    }
}
