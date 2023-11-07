<?php

namespace App\Entities;

/**
 * App\Entities\SurveyItemOption.
 *
 * @property int                           $id
 * @property int                           $survey_item_id
 * @property int|null                      $next_survey_item_id
 * @property int|null                      $position
 * @property string                        $title
 * @property string                        $text
 * @property int                           $is_default
 * @property \App\Entities\SurveyItem      $item
 * @property \App\Entities\SurveyItem|null $nextItem
 *
 * @method static \Illuminate\Database\Eloquent\Builder|SurveyItemOption newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SurveyItemOption newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SurveyItemOption query()
 * @mixin \Eloquent
 */
final class SurveyItemOption extends BaseModel
{
    protected $table = 'surveys_items_options';

    public function item()
    {
        return $this->belongsTo(SurveyItem::class);
    }

    public function nextItem()
    {
        return $this->belongsTo(SurveyItem::class, 'next_survey_item_id');
    }
}
