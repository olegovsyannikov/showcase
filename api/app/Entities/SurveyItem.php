<?php

namespace App\Entities;

/**
 * App\Entities\SurveyItem.
 *
 * @property int                                                                       $id
 * @property int                                                                       $survey_id
 * @property int|null                                                                  $priority
 * @property string|null                                                               $item_type
 * @property string                                                                    $title
 * @property string                                                                    $text
 * @property int                                                                       $is_required
 * @property int                                                                       $is_randomized
 * @property int                                                                       $is_last
 * @property \Illuminate\Database\Eloquent\Collection|\App\Entities\SurveyItemOption[] $options
 * @property int|null                                                                  $options_count
 * @property \App\Entities\Survey                                                      $survey
 *
 * @method static \Illuminate\Database\Eloquent\Builder|SurveyItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SurveyItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SurveyItem query()
 * @mixin \Eloquent
 */
final class SurveyItem extends BaseModel
{
    protected $table = 'surveys_items';

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function options()
    {
        return $this->hasMany(SurveyItemOption::class);
    }
}
