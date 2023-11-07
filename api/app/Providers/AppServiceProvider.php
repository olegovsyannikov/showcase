<?php

namespace App\Providers;

use App\Observers\UserObserver;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Intercom\IntercomClient;
use Modules\Accounting\Entities\User;
use Sendpulse\RestApi\ApiClient;
use Sendpulse\RestApi\Storage\SessionStorage;
use Stripe\StripeClient;
use Zumba\Amplitude\Amplitude;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        $this->app->bind(
            Amplitude::class,
            fn () => Amplitude::getInstance()->init(
                \config('services.amplitude.api_key')
            )
        );

        $this->app->bind(
            ApiClient::class,
            fn () => (new ApiClient(
                \config('services.sendpulse.api_user_id'),
                \config('services.sendpulse.api_secret'),
                new SessionStorage()
            ))
        );

        $this->app->bind(
            IntercomClient::class,
            fn () => (new IntercomClient(
                \config('services.intercom.token'),
            ))
        );

        $this->app->bind(
            StripeClient::class,
            fn () => (new StripeClient([
                'api_key' => \config('services.stripe.secret_key'),
            ]))
        );
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(): void
    {
        if ($this->app->environment('production', 'staging')) {
            URL::forceScheme('https');
        }

        User::observe(UserObserver::class);
    }
}
