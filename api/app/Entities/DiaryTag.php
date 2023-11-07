<?php

namespace App\Entities;

/**
 * App\Entities\DiaryTag.
 *
 * @property int                                                            $id
 * @property string                                                         $title
 * @property int                                                            $emotion
 * @property \Illuminate\Database\Eloquent\Collection|\App\Entities\Diary[] $diaryRecords
 * @property int|null                                                       $diary_records_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder|DiaryTag newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiaryTag newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DiaryTag query()
 * @mixin \Eloquent
 */
final class DiaryTag extends BaseModel
{
    protected $table = 'diary_tags';
    protected $guarded = [];

    public function diaryRecords()
    {
        return $this->belongsToMany(Diary::class, 'diary_ref_tags')->using(DiaryRefTag::class);
    }
}
