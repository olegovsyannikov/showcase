<?php

namespace Modules\Funnels\Entities;

use Illuminate\Database\Eloquent\Model;

/**
 * Modules\Funnels\Entities\Tag.
 *
 * @property int                 $id
 * @property string              $tag
 * @property string              $taggable_type
 * @property int                 $taggable_id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property Model|\Eloquent     $taggable
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Tag newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tag newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tag query()
 * @mixin \Eloquent
 */
final class Tag extends Model
{
    protected $table = 'tags';

    protected $fillable = ['tag'];

    public function taggable()
    {
        return $this->morphTo();
    }
}
