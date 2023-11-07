<?php

namespace Modules\Funnels\Database\Seeders;

use Illuminate\Database\Seeder;

final class FunnelsDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $this->call([
            TriggersSeeder::class,
        ]);
    }
}
