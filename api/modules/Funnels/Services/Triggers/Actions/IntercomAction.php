<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use App\Entities\UserTask;
use Http\Client\Exception;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Arr;
use Intercom\IntercomClient;
use Modules\Funnels\Jobs\IntercomSendJob;
use Modules\Funnels\Services\Triggers\Exceptions\IntercomContactNotFoundException;

final class IntercomAction extends AbstractAction
{
    /**
     * {@inheritdoc}
     */
    public function getDelayKey(): string
    {
        return 'delayed_intercom';
    }

    /**
     * {@inheritdoc}
     */
    public function shouldExecute(): bool
    {
        $this->logger->debug('LEGACY: skip');

        return false;
    }

    /**
     * {@inheritdoc}
     */
    public function run(): void
    {
        $actionData = $this->getData();

        // $delay = $this->getTriggerContext()->getDelayParser()->getDelay($actionData);
        // $user = $this->getTriggerContext()->getUser();

        $message = Arr::get(
            $actionData,
            'payload.message',
            $this->executionContext['intercom_message'] ?? null
        );

        $userTask = UserTask::find($this->executionContext['user_task_id'] ?? null);

        if (!empty($message) && $userTask && $userTask->task->send_to_intercom) {
            // if (!$userTask->intercom_conversation_id) {
            //     $conversationId = $this->getConversationId($userTask->task->title, $user->id);

            //     if ($conversationId) {
            //         $userTask->update([
            //                 'intercom_conversation_id' => $conversationId,
            //             ]);
            //     }
            // }

            $this->dispatch(new IntercomSendJob($userTask, $message));
        }
    }

    // /**
    //  * @param string $title
    //  * @param int    $userId
    //  *
    //  * @return string|null
    //  *
    //  * @throws BindingResolutionException
    //  * @throws Exception
    //  */
    // private function getConversationId(string $title, int $userId): ?string
    // {
    //     $intercomClient = \resolve(IntercomClient::class);

    //     $contact = $intercomClient->contacts->search(['query' => [
    //         'field' => 'external_id',
    //         'operator' => '=',
    //         'value' => (string) $userId,
    //     ]])->data[0] ?? null;

    //     if (empty($contact)) {
    //         throw new IntercomContactNotFoundException('Intercom contact not found');
    //     }

    //     $response = $intercomClient->conversations->create([
    //         'body' => \sprintf('Обсуждение задания "%s"', $title),
    //         'from' => [
    //             'type' => 'user',
    //             'id' => $contact->id,
    //         ],
    //     ]);

    //     return $response->conversation_id;
    // }
}
