<?php

namespace Modules\Funnels\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Modules\Funnels\Services\Triggers\Actions\ActionJobInterface;

abstract class AbstractActionJob implements ActionJobInterface, ShouldQueue
{
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * @var callable|null
     */
    protected $onBeforeHandle = null;

    /**
     * @var callable|null
     */
    protected $onAfterHandle = null;

    /**
     * @var callable|null
     */
    protected $onFailHandler = null;

    /**
     * @return void
     */
    abstract public function run(): void;

    /**
     * @return void
     */
    final public function handle(): void
    {
        try {
            if ($this->onBeforeHandle !== null) {
                \call_user_func($this->onBeforeHandle);
            }

            $this->run();

            if ($this->onAfterHandle !== null) {
                \call_user_func($this->onAfterHandle);
            }
        } catch (\Throwable $th) {
            if ($this->onFailHandler !== null) {
                \call_user_func($this->onFailHandler);
            }

            throw $th;
        }
    }

    /**
     * {@inheritdoc}
     */
    final public function beforeHandle(callable $cb): void
    {
        $this->onBeforeHandle = $cb;
    }

    /**
     * {@inheritdoc}
     */
    final public function afterHandle(callable $cb): void
    {
        $this->onAfterHandle = $cb;
    }

    /**
     * {@inheritdoc}
     */
    final public function onFail(callable $cb): void
    {
        $this->onFailHandler = $cb;
    }
}
