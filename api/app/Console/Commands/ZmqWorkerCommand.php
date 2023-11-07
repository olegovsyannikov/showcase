<?php

namespace App\Console\Commands;

use App\Events\UserCompleteTaskEvent;
use App\Events\UserCreatedEvent;
use App\Events\UserLoggedEvent;
use App\Events\UserPaymentReceived;
use App\Events\UserRegisteredEvent;
use Illuminate\Console\Command;
use ZMQ;
use ZMQContext;

final class ZmqWorkerCommand extends Command
{
    public const ZMQ_USER_CREATED_EVENT = 'USER_CREATED_EVENT';
    public const ZMQ_USER_REGISTERED_EVENT = 'USER_REGISTERED_EVENT';
    public const ZMQ_USER_LOGGED_EVENT = 'USER_LOGGED_EVENT';
    public const ZMQ_USER_COMPLETE_TASK_EVENT = 'USER_COMPLETE_TASK_EVENT';
    public const ZMQ_USER_PAYMENT_STATUS_CHANGED = 'USER_PAYMENT_STATUS_CHANGED';

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'zmq:work';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Listen ZMQ queue';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle(): void
    {
        $context = new ZMQContext();
        $responder = $context->getSocket(ZMQ::SOCKET_REP);
        $responder->bind('tcp://*:5555');

        while (true) {
            try {
                $payload = $responder->recv();

                if ($payload) {
                    $this->info("Received request: {$payload}");

                    $received_data = \json_decode($payload, true, \JSON_THROW_ON_ERROR);

                    [
                        'type' => $type,
                        'data' => $data
                    ] = $received_data;
                    $this->info("Parsed data: type={$type}");

                    if ($type === self::ZMQ_USER_CREATED_EVENT) {
                        [
                            'user_id' => $user_id,
                            'role' => $role,
                        ] = $data;
                        \event(new UserCreatedEvent($user_id, $role));
                    }

                    if ($type === self::ZMQ_USER_REGISTERED_EVENT) {
                        [
                            'user_id' => $user_id,
                            'role' => $role,
                        ] = $data;
                        \event(new UserRegisteredEvent($user_id, $role));
                    }

                    if ($type === self::ZMQ_USER_LOGGED_EVENT) {
                        [
                            'user_id' => $user_id
                        ] = $data;
                        \event(new UserLoggedEvent($user_id));
                    }

                    if ($type === self::ZMQ_USER_COMPLETE_TASK_EVENT) {
                        [
                            'user_id' => $user_id,
                            'task_id' => $task_id
                        ] = $data;
                        \event(new UserCompleteTaskEvent($user_id, $task_id));
                    }

                    if ($type === self::ZMQ_USER_PAYMENT_STATUS_CHANGED) {
                        [
                            'user_id' => $user_id,
                            'payment_id' => $payment_id,
                            'is_initial' => $is_initial
                        ] = $data;
                        \event(new UserPaymentReceived($payment_id, $user_id));
                    }
                }

                $responder->send('OK');
            } catch (\Throwable $th) {
                $this->error("Error processing ZMQ: {$th->getMessage()}");
                $responder->send('ERROR');
            }
        }
    }
}
