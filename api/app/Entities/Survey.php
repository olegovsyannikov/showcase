<?php

namespace App\Entities;

/**
 * App\Entities\Survey.
 *
 * @property int                                                                 $id
 * @property string                                                              $title
 * @property string|null                                                         $text
 * @property int                                                                 $is_active
 * @property \Illuminate\Database\Eloquent\Collection|\App\Entities\SurveyItem[] $items
 * @property int|null                                                            $items_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Survey newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Survey newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Survey query()
 * @mixin \Eloquent
 */
final class Survey extends BaseModel
{
    protected $table = 'surveys';

    public function items()
    {
        return $this->hasMany(SurveyItem::class);
    }

    public function toArray()
    {
        $ret = parent::toArray();
        foreach ($ret['items'] as &$item) {
            if ($item['is_randomize']) {
                \shuffle($item['options']);
            }

            $item['is_' . $item['item_type']] = true;
        }

        return $ret;
    }
}
