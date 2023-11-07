<?php

namespace App\Entities;

use Modules\Accounting\Entities\User;

/**
 * App\Entities\SurveyLog.
 *
 * @property int                                 $id
 * @property \Carbon\Carbon                      $time
 * @property int                                 $user_id
 * @property int                                 $survey_id
 * @property int                                 $survey_item_id
 * @property int|null                            $survey_item_option_id
 * @property string                              $survey_item_answer
 * @property \App\Entities\Survey                $survey
 * @property \App\Entities\SurveyItem            $surveyItem
 * @property \App\Entities\SurveyItemOption|null $surveyItemOption
 * @property User                                $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|SurveyLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SurveyLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SurveyLog query()
 * @mixin \Eloquent
 */
final class SurveyLog extends BaseModel
{
    protected $table = 'surveys_log';
    protected $dates = ['time'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function surveyItem()
    {
        return $this->belongsTo(SurveyItem::class);
    }

    public function surveyItemOption()
    {
        return $this->belongsTo(SurveyItemOption::class);
    }
}
