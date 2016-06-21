<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['fbid', 'name', 'description'];

    public function categories()
    {
        return $this->belongsToMany('App\Category');
    }
}
