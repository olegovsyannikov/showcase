<?php

namespace Modules\Funnels\Services\Triggers\Actions;

interface ActionDelayParserInterface
{
    /**
     * @param array $data
     *
     * @return int
     */
    public function getDelay(array $data): int;

    /**
     * @param string $key
     *
     * @return string|null
     */
    public function getDelayedData(string $key): ?string;

    /**
     * @param string $key
     * @param string $data
     * @param int    $delay
     *
     * @return void
     */
    public function storeDelayedData(string $key, string $data, int $delay): void;
}
