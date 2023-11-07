<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * App\Entities\DiaryRefTag.
 *
 * @property int                    $id
 * @property int                    $diary_id
 * @property int                    $diary_tag_id
 * @property \App\Entities\Diary    $diary
 * @property \App\Entities\DiaryTag $diaryTag
 *
 * @method static \Illuminate\Database\Eloquent\Builder|DiaryRefTag newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiaryRefTag newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiaryRefTag query()
 * @mixin \Eloquent
 */
final class DiaryRefTag extends Pivot
{
    protected $table = 'diary_ref_tags';

    public function diary()
    {
        return $this->belongsTo(Diary::class);
    }

    public function diaryTag()
    {
        return $this->belongsTo(DiaryTag::class);
    }
}
