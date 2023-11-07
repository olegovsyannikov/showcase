<?php

namespace App\Entities;

/**
 * App\Entities\Test.
 *
 * @property int                 $id
 * @property string              $title
 * @property string|null         $description
 * @property string|null         $options
 * @property string|null         $typeform_form_id
 * @property int                 $enabled
 * @property \Carbon\Carbon      $created_at
 * @property \Carbon\Carbon|null $deleted_at
 * @property int|null            $task_id
 * @property string|null         $announce
 * @property string|null         $image
 * @property string|null         $time_to_do
 * @property string|null         $tripetto_definition
 * @property string|null         $token
 * @property string              $language
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Test newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Test newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Test query()
 * @mixin \Eloquent
 */
final class Test extends BaseModel
{
    public $table = 'tests';
    public $dates = ['created_at', 'deleted_at'];

    public function toRestArray()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'form_id' => $this->typeform_form_id,
            'created_at' => $this->created_at->getTimestamp(),
            'announce' => $this->announce,
            'image' => $this->image,
            'time_to_do' => $this->time_to_do,
            'options' => \json_decode($this->options, true),
        ];
    }
}
