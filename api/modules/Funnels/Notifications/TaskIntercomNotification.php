<?php

namespace Modules\Funnels\Notifications;

use App\Entities\UserTask;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use LogicException;
use Zhuk\LaravelIntercom\Contacts\UserMessageContact;
use Zhuk\LaravelIntercom\Messages\CommentConversationReply;
use Zhuk\LaravelIntercom\Messages\MessageInterface;
use Zhuk\LaravelIntercom\Messages\NoteConversationReply;
use Zhuk\LaravelIntercom\NotificationInterface;

final class TaskIntercomNotification extends Notification implements NotificationInterface
{
    use Queueable;

    public const TYPE_NOTE = 0;
    public const TYPE_MESSAGE = 1;

    /**
     * @var string
     */
    private string $messageText;

    /**
     * @var int
     */
    private int $type;

    /**
     * @param string $message
     * @param int    $type
     *
     * @return void
     */
    public function __construct(string $message, int $type = self::TYPE_MESSAGE)
    {
        $this->messageText = $message;
        $this->type = $type;
    }

    /**
     * @param mixed $notifiable
     *
     * @return array
     */
    public function via($notifiable)
    {
        return ['intercom'];
    }

    /**
     * @param mixed $notifiable
     *
     * @return MessageInterface
     */
    public function toIntercom($notifiable): MessageInterface
    {
        if (!$notifiable instanceof UserTask) {
            throw new LogicException('Unknown notifiable type');
        }

        if ($this->type === self::TYPE_NOTE) {
            return new NoteConversationReply($this->messageText, $notifiable->intercom_conversation_id);
        }

        return new CommentConversationReply(
            $this->messageText,
            $notifiable->intercom_conversation_id,
            new UserMessageContact((string) $notifiable->user_id, UserMessageContact::IDENTIFICATION_METHOD_USER_ID)
        );
    }
}
