<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Accounting\Entities\User;

/**
 * App\Entities\MaterialUser.
 *
 * @property int                    $id
 * @property int                    $material_id
 * @property int                    $user_id
 * @property \Carbon\Carbon         $first_seen_time
 * @property \App\Entities\Material $material
 * @property User                   $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|MaterialUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MaterialUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MaterialUser query()
 * @mixin \Eloquent
 */
final class MaterialUser extends BaseModel
{
    protected $table = 'materials_users';

    protected $dates = ['first_seen_time'];

    /**
     * @return BelongsTo
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
