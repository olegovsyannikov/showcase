<?php

namespace Modules\Funnels\Services\Triggers;

use Illuminate\Contracts\Bus\Dispatcher;
use Modules\Funnels\Enums\TriggerActionType;
use Modules\Funnels\Services\Triggers\Actions\ActionInterface;
use Modules\Funnels\Services\Triggers\Actions\AmplitudeAction;
use Modules\Funnels\Services\Triggers\Actions\AssignTasksAction;
use Modules\Funnels\Services\Triggers\Actions\ChangeStageAction;
use Modules\Funnels\Services\Triggers\Actions\CompleteStageAction;
use Modules\Funnels\Services\Triggers\Actions\IntercomAction;
use Modules\Funnels\Services\Triggers\Actions\RemoveFromStageAction;
use Modules\Funnels\Services\Triggers\Actions\SendNotificationAction;
use Modules\Funnels\Services\Triggers\Actions\SendpulseTemplateAction;
use Modules\Funnels\Services\Triggers\Actions\WebhookAction;
use Modules\Funnels\Services\Triggers\Exceptions\UndefinedTriggerActionException;
use Psr\Log\LoggerInterface;

final class DefaultActionStrategy implements ActionStrategyInterface
{
    /**
     * @var LoggerInterface
     */
    private LoggerInterface $logger;

    /**
     * @var Dispatcher
     */
    private Dispatcher $dispatcher;

    public function __construct(LoggerInterface $logger, Dispatcher $dispatcher)
    {
        $this->logger = $logger;
        $this->dispatcher = $dispatcher;
    }

    /**
     * {@inheritdoc}
     *
     * @throws UndefinedTriggerActionException
     */
    public function createAction(array $data, TriggerContextInterface $context): ActionInterface
    {
        switch ($data['type'] ?? null) {
            case TriggerActionType::assignTasks()->value:
                $classNme = AssignTasksAction::class;
                break;

            case TriggerActionType::changeStage()->value:
                $classNme = ChangeStageAction::class;
                break;

            case TriggerActionType::completeStage()->value:
                $classNme = CompleteStageAction::class;
                break;

            case TriggerActionType::removeFromStage()->value:
                $classNme = RemoveFromStageAction::class;
                break;

            case TriggerActionType::sendNotification()->value:
                $classNme = SendNotificationAction::class;
                break;

            case TriggerActionType::sendAmplitudeEvent()->value:
                $classNme = AmplitudeAction::class;
                break;

            case TriggerActionType::sendpulseTemplateSend()->value:
                $classNme = SendpulseTemplateAction::class;
                break;

            case TriggerActionType::intercomSend()->value:
                $classNme = IntercomAction::class;
                break;

            case TriggerActionType::webhook()->value:
                $classNme = WebhookAction::class;
                break;

            default:
                /** @var string */
                $error = \trans('Undefined trigger action');
                throw new UndefinedTriggerActionException($error);
        }

        return new $classNme($data, $context, $this->logger, $this->dispatcher);
    }
}
