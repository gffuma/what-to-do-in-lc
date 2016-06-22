<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'fbid', 'fb_attending_count', 'fb_cover_image_url',
        'name', 'description',
        'latitude', 'longitude',
        'country', 'city', 'street', 'zip', 'place_name',
        'start_time', 'end_time'
    ];

    public function categories()
    {
        return $this->belongsToMany('App\Category');
    }
}
