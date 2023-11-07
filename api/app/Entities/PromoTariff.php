<?php

namespace App\Entities;

/**
 * App\Entities\PromoTariff.
 *
 * @property int                 $id
 * @property string              $code
 * @property int                 $tariff_plan
 * @property int                 $is_active
 * @property \Carbon\Carbon      $start_at
 * @property \Carbon\Carbon|null $expires_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|PromoTariff newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PromoTariff newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PromoTariff query()
 * @mixin \Eloquent
 */
final class PromoTariff extends BaseModel
{
    protected $table = 'promo_tariff';
    public $dates = ['start_at', 'expires_at'];
}
