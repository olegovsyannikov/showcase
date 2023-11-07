<?php

namespace Modules\Funnels\Jobs;

use App\Entities\UserTask;
use Http\Client\Exception;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Database\Eloquent\MassAssignmentException;
use Intercom\IntercomClient;
use Modules\Funnels\Notifications\TaskIntercomNotification;
use Modules\Funnels\Services\Triggers\Exceptions\IntercomContactNotFoundException;

final class IntercomSendJob extends AbstractActionJob
{
    /**
     * @var UserTask
     */
    private UserTask $userTask;

    /**
     * @var string
     */
    private string $message;

    /**
     * @var string|null
     */
    private ?string $meta;

    /**
     * @param UserTask    $userTask
     * @param string      $message
     * @param string|null $meta
     *
     * @return void
     */
    public function __construct(UserTask $userTask, string $message, ?string $meta = null)
    {
        $this->userTask = $userTask;
        $this->message = $message;
        $this->meta = $meta;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function run(): void
    {
        if ($this->userTask->intercom_conversation_id === null) {
            $this->createConversation();
        }

        $this->userTask->notify(new TaskIntercomNotification($this->message));

        if ($this->meta !== null) {
            $this->userTask->notify(new TaskIntercomNotification($this->meta, TaskIntercomNotification::TYPE_NOTE));
        }
    }

    /**
     * @return void
     *
     * @throws BindingResolutionException
     * @throws Exception
     * @throws IntercomContactNotFoundException
     * @throws MassAssignmentException
     */
    private function createConversation(): void
    {
        $intercomClient = \resolve(IntercomClient::class);

        $contact = $intercomClient->contacts->search(['query' => [
            'field' => 'external_id',
            'operator' => '=',
            'value' => (string) $this->userTask->user_id,
        ]])->data[0] ?? null;

        if ($contact === null) {
            $contact = $intercomClient->contacts->search(['query' => [
                'field' => 'email',
                'operator' => '=',
                'value' => $this->userTask->user->email,
            ]])->data[0] ?? null;
        }

        if ($contact === null) {
            $contact = $intercomClient->contacts->create([
                'role' => 'user',
                'external_id' => $this->userTask->user->id,
                'email' => $this->userTask->user->email ?? '',
                'name' => $this->userTask->user->name ?? '',
            ]);
        }

        if (empty($contact)) {
            throw new IntercomContactNotFoundException('Intercom contact not found');
        }

        $response = $intercomClient->conversations->create([
            'body' => \sprintf("Обсуждение задания \"%s\"\n\n", $this->userTask->task->title),
            'from' => [
                'type' => 'user',
                'id' => $contact->id,
            ],
        ]);

        $this->userTask->update([
            'intercom_conversation_id' => $response->conversation_id,
        ]);
    }
}
