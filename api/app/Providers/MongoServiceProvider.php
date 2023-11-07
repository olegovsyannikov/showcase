<?php

namespace App\Providers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use MongoDB\Client;
use MongoDB\Database;

final class MongoServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register(): void
    {
        // $this->app->singleton(Client::class, function () {
        //     return $this->getClient();
        // });

        // $this->app->singleton(Database::class, function () {
        //     return $this->getClient()->selectDatabase(\getenv('MONGO_DATABASE'));
        // });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(): void
    {
        // Storage::extend('gridfs', function ($app, $config) {
        //     //
        // });
    }

    // /**
    //  * @return Client
    //  */
    // protected function getClient(): Client
    // {
    //     return new Client(
    //         sprintf('mongodb://%s/', \getenv('MONGO_HOST')),
    //         [
    //             'username' => \getenv('MONGO_USER'),
    //             'password' => \getenv('MONGO_PASSWORD'),
    //         ],
    //     );
    // }
}
