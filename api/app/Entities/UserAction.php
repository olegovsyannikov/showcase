<?php

namespace App\Entities;

/**
 * App\Entities\UserAction.
 *
 * @property int    $id
 * @property string $title
 *
 * @method static \Illuminate\Database\Eloquent\Builder|UserAction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserAction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserAction query()
 * @mixin \Eloquent
 */
final class UserAction extends BaseModel
{
    protected $table = 'users_actions';
}
