<?php

namespace Modules\Diary\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use InvalidArgumentException;
use NotificationChannels\OneSignal\OneSignalChannel;
use NotificationChannels\OneSignal\OneSignalMessage;

final class Reminder extends Notification
{
    use Queueable;

    /**
     * @var array
     */
    protected const MESSAGES = [
        'ru' => [
            [
                'Как ваш день?',
                'Самое время подвести итоги.📝',
            ],
            [
                'Дневник🚀',
                'Не забудьте отметить свое настроение',
            ],
            [
                'Дневник настроений',
                'Как вы себя чувствуете?',
            ],
            [
                'Дневник ждет вас😺',
                'Готовы подвести итоги?',
            ],
            [
                'Время настроений😊',
                'Сделайте запись в своем дневнике',
            ],
            [
                'Как прошел ваш день?',
                'Запишите в свой дневник настроение!',
            ],
            [
                'Как дела?',
                'Отметьте в дневнике😉',
            ],
            [
                'Ваш дневничок😚',
                'Чем вы сегодня занимались?',
            ],
            [
                'Время дневника',
                'Отметьте, что вы чувствуете',
            ],
            [
                'Настроение-тайм',
                'Что вы чувствуете?',
            ],
            [
                'Дневничок ждет🥺',
                'Как прошел день?',
            ],
        ],
    ];

    /**
     * @var string
     */
    public $title;

    /**
     * @var string
     */
    public $body;

    /**
     * @param string|null $locale
     */
    public function __construct(?string $locale)
    {
        [$title, $body] = $this->getMessage($locale);

        $this->title = $title;
        $this->body = $body;
    }

    /**
     * @param mixed $notifiable
     *
     * @return array
     */
    public function via($notifiable)
    {
        return [OneSignalChannel::class];
    }

    /**
     * @param mixed $notifiable
     *
     * @return OneSignalMessage
     */
    public function toOneSignal($notifiable)
    {
        return OneSignalMessage::create()
            ->setSubject($this->title)
            ->setBody($this->body);
    }

    /**
     * Get diary message.
     *
     * @param string|null $locale
     *
     * @return array
     */
    protected function getMessage(?string $locale): array
    {
        if ($locale === null || !\array_key_exists($locale, self::MESSAGES)) {
            throw new InvalidArgumentException(\__("Reminder locale \"{$locale}\" does not exists"));
        }

        return \collect(self::MESSAGES[$locale])->random();
    }
}
