<?php

namespace Modules\Funnels\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\Funnels\Console\CheckUsersState;
use Modules\Funnels\Console\ExecuteDelayedActions;
use Modules\Funnels\Console\MoveUserToStage;
use Modules\Funnels\Console\ShowFunnelsTree;
use Modules\Funnels\Console\InitUsersFunnels;
use Modules\Funnels\Services\Triggers\ActionStrategyInterface;
use Modules\Funnels\Services\Triggers\DefaultActionStrategy;

final class FunnelsServiceProvider extends ServiceProvider
{
    /**
     * @var string
     */
    protected $moduleName = 'Funnels';

    /**
     * @var string
     */
    protected $moduleNameLower = 'funnels';

    /**
     * Boot the application events.
     *
     * @return void
     */
    public function boot(): void
    {
        $this->registerTranslations();
        $this->registerConfig();
        $this->registerFactories();
        $this->registerCommands();
        $this->loadMigrationsFrom(\module_path($this->moduleName, 'Database/Migrations'));
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register(): void
    {
        $this->app->register(RouteServiceProvider::class);

        $this->app->bind(ActionStrategyInterface::class, DefaultActionStrategy::class);
    }

    /**
     * Register config.
     *
     * @return void
     */
    protected function registerConfig(): void
    {
        $this->publishes([
            \module_path($this->moduleName, 'Config/config.php') => \config_path($this->moduleNameLower . '.php'),
        ], 'config');

        $this->mergeConfigFrom(
            \module_path($this->moduleName, 'Config/config.php'),
            $this->moduleNameLower
        );
    }

    /**
     * Register translations.
     *
     * @return void
     */
    public function registerTranslations(): void
    {
        $langPath = \resource_path('lang/modules/' . $this->moduleNameLower);

        if (\is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $this->moduleNameLower);
        } else {
            $this->loadTranslationsFrom(\module_path($this->moduleName, 'Resources/lang'), $this->moduleNameLower);
        }
    }

    /**
     * Register an additional directory of factories.
     *
     * @return void
     */
    public function registerFactories(): void
    {
        // if (!app()->environment(['production', 'staging']) && $this->app->runningInConsole()) {
        //     app(Factory::class)->load(module_path($this->moduleName, 'Database/factories'));
        // }
    }

    /**
     * Register console commands.
     *
     * @return void
     */
    public function registerCommands(): void
    {
        $this->commands([
            MoveUserToStage::class,
            CheckUsersState::class,
            ShowFunnelsTree::class,
            ExecuteDelayedActions::class,
            InitUsersFunnels::class,
        ]);
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [];
    }

    private function getPublishableViewPaths(): array
    {
        $paths = [];
        foreach (\config('view.paths') as $path) {
            if (\is_dir($path . '/modules/' . $this->moduleNameLower)) {
                $paths[] = $path . '/modules/' . $this->moduleNameLower;
            }
        }

        return $paths;
    }
}
