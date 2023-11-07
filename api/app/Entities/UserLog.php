<?php

namespace App\Entities;

use Modules\Accounting\Entities\User;

/**
 * App\Entities\UserLog.
 *
 * @property int                      $id
 * @property \Carbon\Carbon           $time
 * @property int                      $user_id
 * @property int                      $user_action_id
 * @property string                   $action_body
 * @property User                     $user
 * @property \App\Entities\UserAction $userAction
 *
 * @method static \Illuminate\Database\Eloquent\Builder|UserLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserLog query()
 * @mixin \Eloquent
 */
final class UserLog extends BaseModel
{
    protected $table = 'users_log';
    protected $dates = ['time'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function userAction()
    {
        return $this->belongsTo(UserAction::class);
    }
}
