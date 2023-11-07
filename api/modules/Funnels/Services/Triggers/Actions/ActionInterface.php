<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Modules\Funnels\Services\Triggers\TriggerContextInterface;

interface ActionInterface
{
    public const STATUS_IS_RUNNING = 0;
    public const STATUS_OK = 1;
    public const STATUS_FAIL = 2;

    /**
     * @param array $executionContext
     *
     * @return void
     */
    public function execute(array $executionContext): void;

    /**
     * @return bool
     */
    public function shouldExecute(): bool;

    /**
     * @return string
     */
    public function getType(): string;

    /**
     * @return array
     */
    public function getData(): array;

    /**
     * @return TriggerContextInterface
     */
    public function getTriggerContext(): TriggerContextInterface;
}
