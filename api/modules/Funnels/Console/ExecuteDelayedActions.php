<?php

namespace Modules\Funnels\Console;

use App\Notifications\DummyFcmNotify;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\MassAssignmentException;
use Modules\Funnels\Entities\ActionDelay;
use Modules\Funnels\Jobs\AddUserToFunnelStageJob;
use Modules\Funnels\Jobs\AssignTasksJob;
use Modules\Funnels\Jobs\CompleteFunnelStageJob;
use Modules\Funnels\Jobs\IntercomSendJob;
use Modules\Funnels\Jobs\RemoveUserFromFunnelStageJob;
use Modules\Funnels\Jobs\SendAmplitudeEventJob;
use Modules\Funnels\Jobs\SendpulseTemplateSendJob;
use Modules\Funnels\Jobs\SendWebhookJob;
use Modules\Funnels\Services\Triggers\Actions\ActionJobInterface;

final class ExecuteDelayedActions extends Command
{
    /**
     * {@inheritdoc}
     */
    protected $signature = 'sober:funnels:execute-delayed-actions';

    /**
     * {@inheritdoc}
     */
    protected $description = 'Execute delayed actions.';

    /**
     * {@inheritdoc}
     */
    public function handle(): void
    {
        ActionDelay::with(['user'])
            ->whereNull('processed_at')
            ->where('should_run_at', '<', Carbon::now())
            ->chunk(30, function (Collection $items): void {
                $items->each(function (ActionDelay $actionDelay): void {
                    $data = \unserialize($actionDelay->data);

                    if ($data instanceof ActionJobInterface) {
                        \dispatch($data);
                    } else {
                        $this->legacyProcess($actionDelay);
                    }

                    $actionDelay->update(['processed_at' => Carbon::now()]);
                });
            });
    }

    /**
     * @param ActionDelay $actionDelay
     *
     * @return void
     *
     * @throws BindingResolutionException
     * @throws MassAssignmentException
     */
    private function legacyProcess(ActionDelay $actionDelay): void
    {
        switch ($actionDelay->key_code) {
            case 'delayed_tasks':
                \dispatch(new AssignTasksJob(
                    $actionDelay->user,
                    \unserialize($actionDelay->data),
                    $actionDelay->funnel_stage_id,
                    $actionDelay->trigger_id
                ));
                break;
            case 'delayed_remove':
                \dispatch(new RemoveUserFromFunnelStageJob(
                    $actionDelay->user,
                    $actionDelay->funnelStage
                ));
                break;
            case 'delayed_notify':
                $actionDelay->user->notify(
                    new DummyFcmNotify(\unserialize($actionDelay->data))
                );
                break;
            case 'delayed_complete':
                \dispatch(new CompleteFunnelStageJob(
                    $actionDelay->user,
                    $actionDelay->funnelStage
                ));
                break;
            case 'delayed_change':
                [
                    'funnelStage' => $funnelStage,
                ] = \unserialize($actionDelay->data);

                \dispatch(new AddUserToFunnelStageJob(
                    $actionDelay->user,
                    $funnelStage
                ));
                break;
            case 'delayed_amplitude':
                \dispatch(new SendAmplitudeEventJob(
                    $actionDelay->user,
                    \unserialize($actionDelay->data)
                ));
                break;
            case 'delayed_sendpulse':
                [
                    'subject' => $subject,
                    'userId' => $userId,
                    'templateId' => $templateId,
                    'variables' => $variables,
                ] = \unserialize($actionDelay->data);

                \dispatch(new SendpulseTemplateSendJob(
                    $subject,
                    $userId,
                    $templateId,
                    $variables
                ));
                break;
            // case 'delayed_intercom':
            //     [
            //         'userTask' => $userTask,
            //         'message' => $message,
            //     ] = \unserialize($actionDelay->data);

            //     \dispatch(new IntercomSendJob(
            //         $userTask,
            //         $message
            //     ));
            //     break;
            case 'delayed_webhook':
                [
                    'url' => $url,
                    'data' => $data,
                ] = \unserialize($actionDelay->data);

                \dispatch(new SendWebhookJob($url, $data));
                break;
            default:
                break;
        }
    }
}
