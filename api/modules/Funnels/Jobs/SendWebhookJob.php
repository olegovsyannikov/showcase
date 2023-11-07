<?php

namespace Modules\Funnels\Jobs;

use GuzzleHttp\Client;

final class SendWebhookJob extends AbstractActionJob
{
    /**
     * @var string
     */
    private string $url;

    /**
     * @var array
     */
    private array $data;

    /**
     * @param string $url
     * @param array  $data
     *
     * @return void
     */
    public function __construct(string $url, array $data)
    {
        $this->url = $url;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function run(): void
    {
        $client = new Client();
        $client->request('POST', $this->url, [
            'json' => $this->data,
        ]);
    }
}
