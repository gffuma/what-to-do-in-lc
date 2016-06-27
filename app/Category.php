<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model
{
    protected $fillable = [ 'name', 'description', 'secret'];

    protected $hidden = ['pivot'];

    public function events()
    {
        return $this->belongsToMany('App\Event');
    }

    public function scopeNotSecrets($query)
    {
        $query->where('secret', false);
    }

    public function scopeSecrets($query)
    {
        $query->where('secret', true);
    }
}
