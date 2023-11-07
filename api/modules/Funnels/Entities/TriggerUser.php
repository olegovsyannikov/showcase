<?php

namespace Modules\Funnels\Entities;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

final class TriggerUser extends Model
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'trigger_user';

    /**
     * {@inheritdoc}
     */
    protected $fillable = ['user_id', 'trigger_id', 'completed_at'];

    /**
     * @return void
     */
    public function complete(): void
    {
        $this->completed_at = Carbon::now();
    }

    /**
     * @return bool
     */
    public function isCompleted(): bool
    {
        return $this->completed_at !== null;
    }
}
