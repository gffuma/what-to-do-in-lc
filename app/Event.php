<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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

    // This means no categories associed or no secret categories
    // associed
    public function scopeVisible($query)
    {
        return $query
            ->has('categories', '=', 0)
            ->orWhereHas('categories', function ($query) {
                $query->notSecrets();
            });
    }

    public function scopeSecret($query)
    {
        return $query->whereHas('categories', function ($query) {
            $query->secret();
        });
    }

    public function scopeUpcoming($query)
    {
        $near = Carbon::now()->addWeeks(2);
        return $query->future()->where('start_time', '<', $near);
    }

    public function scopeFuture($query)
    {
        return $query->where(function ($query) {
            $now = Carbon::now();
                  // ~ 1 Hours
            $query->where('end_time', '>', $now->addHours(1))
                  // ~ 3 Hours
                  ->orWhere('start_time', '>', $now->subHours(3));
        });
    }

}
