<?php

namespace App\Providers;

use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Support\ServiceProvider;
use phpcent\Client;

final class CentrifugoServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register(): void
    {
        $this->app->bind(Client::class, fn ($app) => $this->createClient());
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(BroadcastManager $broadcastManager): void
    {
        // $broadcastManager->extend('centrifuge', function ($app) {
        //     return new CentrifugeBroadcaster($app->make('centrifuge'));
        // });
    }

    /**
     * Create phpcent centrifugo client.
     *
     * @return Client
     */
    protected function createClient(): Client
    {
        return new Client(
            \config('centrifugo.api.url'),
            \config('centrifugo.api.key'),
            \config('centrifugo.api.secret')
        );
    }
}
