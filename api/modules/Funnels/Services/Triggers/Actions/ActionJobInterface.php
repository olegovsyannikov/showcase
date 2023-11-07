<?php

namespace Modules\Funnels\Services\Triggers\Actions;

interface ActionJobInterface
{
    /**
     * @param callable $cb
     *
     * @return void
     */
    public function beforeHandle(callable $cb): void;

    /**
     * @param callable $cb
     *
     * @return void
     */
    public function afterHandle(callable $cb): void;

    /**
     * @param callable $cb
     *
     * @return void
     */
    public function onFail(callable $cb): void;
}
