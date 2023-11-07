<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Accounting\Entities\User;

/**
 * App\Entities\TestResult.
 *
 * @property int                $id
 * @property int                $test_id
 * @property int                $user_id
 * @property string|null        $answers
 * @property string|null        $token
 * @property \Carbon\Carbon     $submited_at
 * @property \App\Entities\Test $test
 * @property User               $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|TestResult newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TestResult newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TestResult query()
 * @mixin \Eloquent
 */
final class TestResult extends BaseModel
{
    public $table = 'tests_results';

    public $dates = ['submited_at'];

    /**
     * @return BelongsTo
     */
    public function test(): BelongsTo
    {
        return $this->belongsTo(Test::class);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
