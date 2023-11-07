<?php

namespace App\Entities;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Accounting\Entities\User;

/**
 * App\Entities\Diary.
 *
 * @property int                                                               $id
 * @property int                                                               $user_id
 * @property float                                                             $summary
 * @property int|null                                                          $sleep
 * @property int|null                                                          $mood
 * @property int|null                                                          $peace
 * @property int|null                                                          $activity
 * @property int|null                                                          $motivation
 * @property string|null                                                       $comment
 * @property \Carbon\Carbon                                                    $created_at
 * @property \Carbon\Carbon|null                                               $updated_at
 * @property \Carbon\Carbon                                                    $timestamp
 * @property int|null                                                          $tracker
 * @property int|null                                                          $craving
 * @property int|null                                                          $emotions_valence
 * @property int|null                                                          $emotions_intensity
 * @property int|null                                                          $use_quantity
 * @property \Illuminate\Database\Eloquent\Collection|\App\Entities\DiaryTag[] $tags
 * @property int|null                                                          $tags_count
 * @property User                                                              $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Diary newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Diary newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Diary query()
 * @mixin \Eloquent
 */
final class Diary extends BaseModel
{
    public $dates = [
        'created_at',
        'updated_at',
        'timestamp',
    ];

    protected $table = 'diary';

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsToMany
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(DiaryTag::class, 'diary_ref_tags')->using(DiaryRefTag::class);
    }

    /**
     * @return bool
     */
    public function isEditable()
    {
        return $this->created_at->diffInHours(Carbon::now('UTC')) < 24;
    }

    /**
     * @return array
     */
    public function getTagsArray()
    {
        $tagsArray = [];
        foreach ($this->tags as $tag) {
            $tagsArray[] = ['id' => $tag->id, 'title' => $tag->title];
        }

        return $tagsArray;
    }

    /**
     * @return array
     */
    public function toOutArray()
    {
        $diary = $this->attributesToArray();

        $diary['rating'] = $diary['summary'];
        $diary['is_editable'] = $this->isEditable();
        $diary['tags'] = $this->getTagsArray();
        $diary['timestamp'] = $this->timestamp->getTimestamp();

        unset($diary['summary']);
        unset($diary['created_at']);
        unset($diary['updated_at']);

        return $diary;
    }
}
