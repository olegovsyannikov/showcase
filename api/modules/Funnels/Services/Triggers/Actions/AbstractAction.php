<?php

namespace Modules\Funnels\Services\Triggers\Actions;

use Illuminate\Contracts\Bus\Dispatcher;
use Laravel\SerializableClosure\SerializableClosure;
use Modules\Funnels\Entities\TriggerUserAction;
use Modules\Funnels\Services\Triggers\TriggerContextInterface;
use Psr\Log\LoggerInterface;

abstract class AbstractAction implements ActionInterface
{
    /**
     * @var array
     */
    protected array $data;

    /**
     * @var TriggerContextInterface
     */
    protected TriggerContextInterface $context;

    /**
     * @var LoggerInterface
     */
    protected LoggerInterface $logger;

    /**
     * @var Dispatcher
     */
    protected Dispatcher $dispatcher;

    /**
     * @var array
     */
    protected array $executionContext = [];

    /**
     * {@inheritdoc}
     */
    abstract public function shouldExecute(): bool;

    /**
     * @return void
     */
    abstract protected function run(): void;

    /**
     * @return string
     */
    abstract protected function getDelayKey(): string;

    /**
     * @param array                   $data
     * @param TriggerContextInterface $context
     *
     * @return void
     */
    public function __construct(
        array $data,
        TriggerContextInterface $context,
        LoggerInterface $logger,
        Dispatcher $dispatcher
    ) {
        $this->data = $data;
        $this->context = $context;
        $this->logger = $logger;
        $this->dispatcher = $dispatcher;
    }

    /**
     * {@inheritdoc}
     */
    final public function getType(): string
    {
        return $this->data['type'] ?? \md5(\serialize($this->data));
    }

    /**
     * {@inheritdoc}
     */
    final public function getData(): array
    {
        return $this->data;
    }

    /**
     * {@inheritdoc}
     */
    final public function getTriggerContext(): TriggerContextInterface
    {
        return $this->context;
    }

    /**
     * {@inheritdoc}
     */
    final public function execute(array $executionContext): void
    {
        $this->logger->debug("Run action {$this->getType()}");

        $delayData = $this
            ->getTriggerContext()
            ->getDelayParser()
            ->getDelayedData($this->getDelayKey());

        if (empty($delayData)) {
            $this->executionContext = $executionContext;

            $entity = TriggerUserAction::where('user_id', $this->context->getUser()->id)
                ->where('trigger_id', $this->context->getTrigger()->id)
                ->where('type', $this->getType())
                ->firstOrFail();

            try {
                $this->run();
            } catch (\Throwable $th) {
                $this->logger->error($th->getMessage());
                $entity->status = ActionInterface::STATUS_FAIL;
            }

            $entity->save();
        }
    }

    /**
     * @param ActionJobInterface $job
     *
     * @return void
     */
    final protected function dispatch(ActionJobInterface $job, ?int $delay = null): void
    {
        $entity = TriggerUserAction::where('user_id', $this->context->getUser()->id)
            ->where('trigger_id', $this->context->getTrigger()->id)
            ->where('type', $this->getType())
            ->firstOrFail();

        $trigger = $this->getTriggerContext()->getTrigger();
        $user = $this->getTriggerContext()->getUser();

        $job->afterHandle(new SerializableClosure(function () use ($entity, $trigger, $user): void {
            $entity->status = ActionInterface::STATUS_OK;
            $entity->save();

            $trigger->tryToComplete($user);
        }));

        $job->onFail(new SerializableClosure(function () use ($entity): void {
            $entity->status = ActionInterface::STATUS_FAIL;
            $entity->save();
        }));

        if ($delay === null) {
            $delay = $this
                ->getTriggerContext()
                ->getDelayParser()
                ->getDelay($this->data);
        }

        if ($delay > 0) {
            $this->logger->debug("delay: {$delay}");

            $this
                ->getTriggerContext()
                ->getDelayParser()
                ->storeDelayedData(
                    $this->getDelayKey(),
                    \serialize($job),
                    $delay
                );
        } else {
            $this->dispatcher->dispatch($job);
        }
    }
}
