<?php

namespace App\Entities;

/**
 * App\Entities\Notification.
 *
 * @property int            $id
 * @property string         $send_params
 * @property string         $idempotent_key
 * @property string|null    $onesignal_id
 * @property int|null       $onesignal_rcpt_num
 * @property \Carbon\Carbon $created_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Notification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Notification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Notification query()
 * @mixin \Eloquent
 */
final class Notification extends BaseModel
{
    protected $table = 'notifications';
    protected $dates = ['created_at'];
}
