<?php

namespace App\Console\Commands;

use App\Events\UserBecomePaidEvent;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Modules\Accounting\Entities\User;

final class ChangeUserPaymentStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sober:users:change-payment-status {user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change user payment status';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {
            $user = User::findOrFail($this->argument('user'));
        } catch (ModelNotFoundException $e) {
            $user = User::where('email', $this->argument('user'))->firstOrFail();
        }

        $status = $this->choice(
            'Select user payment status',
            ['paid', 'free'],
        );

        if ($status === 'paid') {
            \event(new UserBecomePaidEvent($user->id, true));
        }
    }
}
