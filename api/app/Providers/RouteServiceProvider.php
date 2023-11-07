<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

final class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map(): void
    {
        Route::prefix('api/v2')
            ->name('api.v2')
            ->group(\base_path('routes/api.php'));
    }
}
