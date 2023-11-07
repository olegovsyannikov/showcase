<?php

namespace Modules\Funnels\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modules\Funnels\Entities\Funnel.
 *
 * @property int                                                                              $id
 * @property string                                                                           $title
 * @property string|null                                                                      $description
 * @property \Carbon\Carbon|null                                                              $created_at
 * @property \Carbon\Carbon|null                                                              $updated_at
 * @property int                                                                              $is_default
 * @property \Illuminate\Database\Eloquent\Collection|\Modules\Funnels\Entities\FunnelStage[] $stages
 * @property int|null                                                                         $stages_count
 * @property \Illuminate\Database\Eloquent\Collection|\Modules\Funnels\Entities\Trigger[]     $triggers
 * @property int|null                                                                         $triggers_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Funnel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Funnel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Funnel query()
 * @mixin \Eloquent
 */
final class Funnel extends Model
{
    protected $table = 'funnels';

    protected $fillable = ['title', 'description'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function stages(): HasMany
    {
        return $this->hasMany(FunnelStage::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function triggers(): BelongsToMany
    {
        return $this->belongsToMany(Trigger::class);
    }
}
