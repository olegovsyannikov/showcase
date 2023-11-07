<?php

namespace Modules\Funnels\Jobs;

use Exception;
use Modules\Accounting\Entities\User;
use Sendpulse\RestApi\ApiClient;

final class SendpulseTemplateSendJob extends AbstractActionJob
{
    /**
     * @var int
     */
    private int $userId;

    /**
     * @var string
     */
    private string $subject;

    /**
     * @var int
     */
    private int $templateId;

    /**
     * @var array
     */
    private array $variables;

    /**
     * @param string $subject
     * @param int    $userId
     * @param int    $templateId
     * @param array  $variables
     *
     * @return void
     */
    public function __construct(string $subject, int $userId, int $templateId, array $variables = [])
    {
        $this->subject = $subject;
        $this->userId = $userId;
        $this->templateId = $templateId;
        $this->variables = $variables;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function run(): void
    {
        $sendpulseClient = \resolve(ApiClient::class);

        $user = User::find($this->userId);

        if ($user && $user->email) {
            $ret = $sendpulseClient->smtpSendMail([
                'subject' => $this->subject,
                'from' => [
                    'name' => \config('mail.from.name'),
                    'email' => \config('mail.from.address'),
                ],
                'to' => [[
                    'name' => $user->name,
                    'email' => $user->email,
                ]],
                'template' => [
                    'id' => $this->templateId,
                    'variables' => $this->variables,
                ],
            ]);

            if (isset($ret->is_error) || isset($ret->data->is_error)) {
                throw new Exception($ret->message ?? $ret->curlErrors, $ret->http_code);
            }
        }
    }
}
