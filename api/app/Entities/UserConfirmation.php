<?php

namespace App\Entities;

use Modules\Accounting\Entities\User;
use Ramsey\Uuid\Uuid;

/**
 * App\Entities\UserConfirmation.
 *
 * @property int    $id
 * @property int    $user_id
 * @property string $token
 * @property User   $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|UserConfirmation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserConfirmation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserConfirmation query()
 * @mixin \Eloquent
 */
final class UserConfirmation extends BaseModel
{
    public $table = 'users_confirmations';

    /**
     * @return \Ramsey\Uuid\UuidInterface
     */
    public static function generateToken()
    {
        return Uuid::uuid4();
    }

    /**
     * @param string $token
     *
     * @return UserConfirmation
     */
    public static function getByToken(string $token)
    {
        return static::where('token', $token)->firstOrFail();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return bool
     */
    public function confirm()
    {
        if ($this->user->is_email_confirmed !== 0) {
            return false;
        }

        $this->user->is_email_confirmed = 1;

        try {
            $this->user->saveOrFail();
        } catch (\Throwable $e) {
            return false;
        }

        return true;
    }
}
