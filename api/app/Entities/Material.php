<?php

namespace App\Entities;

/**
 * App\Entities\Material.
 *
 * @property int         $id
 * @property int|null    $position
 * @property int         $type
 * @property int         $stage
 * @property string|null $image
 * @property string      $title
 * @property string|null $announce
 * @property string|null $text
 * @property string|null $time_to_do
 * @property int         $is_active
 * @property string|null $meta
 * @property int         $availability
 * @property int|null    $task_id
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Material newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Material newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Material query()
 * @mixin \Eloquent
 */
final class Material extends BaseModel
{
    public const FOR_FREE = 1;
    public const FOR_PAID = 2;
    public const FOR_ALL = 3;

    protected $table = 'materials';

    /**
     * {@inheritdoc}
     */
    public function attributesToArray()
    {
        $attributes = parent::attributesToArray();

        if ($this->meta) {
            $attributes['meta'] = \json_decode($this->meta, true) ?? null;
        }

        return $attributes;
    }
}
