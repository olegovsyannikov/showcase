<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Modules\Accounting\Entities\User;
use Modules\Funnels\Entities\Funnel;
use Modules\Funnels\Entities\FunnelStage;
use Modules\Funnels\Events\UserEnterFunnelStageEvent;

final class UpgradeMigrateUsers extends Command
{
    public const FUNNEL_RU_FREE_ID = 1;
    public const FUNNEL_RU_PAID_ID = 2;
    public const FUNNEL_EN_FREE_ID = 3;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sober:upgrade:migrate-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate all users into funnels';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        User::chunk(200, function ($users): void {
            foreach ($users as $user) {
                $this->info("User #{$user->id}");

                $stage = 1;
                if ($user->stage > 0) {
                    $stage = $user->stage + 1;
                }

                if (!$user->language || $stage > 1) {
                    $user->update(['language' => 'ru']);
                    $user->refresh();
                }

                if ($user->language === 'en') {
                    $freeFunnel = Funnel::findOrFail(self::FUNNEL_EN_FREE_ID);
                } else {
                    $freeFunnel = Funnel::findOrFail(self::FUNNEL_RU_FREE_ID);
                }

                if ($user->stages()->count() === 0) {
                    $this->info("  add to free funnel #{$freeFunnel->id}");
                    /** @var FunnelStage|null $freeFunnelStage */
                    $freeFunnelStage = $freeFunnel->stages()->where('position', 1)->first();
                    if ($freeFunnelStage) {
                        $freeFunnelStage->users()->syncWithoutDetaching([$user->id => ['is_active' => true]]);
                        \event(new UserEnterFunnelStageEvent($user, $freeFunnelStage));
                    }

                    if ($user->is_paid) {
                        $paidFunnel = Funnel::findOrFail(self::FUNNEL_RU_PAID_ID);
                        $this->info("  add to paid funnel #{$paidFunnel->id} stage #{$stage}");
                        /** @var FunnelStage|null $paidFunnelStage */
                        $paidFunnelStage = $paidFunnel->stages()->where('position', $stage)->first();
                        if ($paidFunnelStage) {
                            $paidFunnelStage->users()->syncWithoutDetaching([$user->id => ['is_active' => true]]);
                            \event(new UserEnterFunnelStageEvent($user, $paidFunnelStage));
                        }
                    }
                } else {
                    $this->info('  skip');
                }
            }
        });
    }
}
