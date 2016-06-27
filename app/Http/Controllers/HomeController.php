<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Event;
use App\Category;

class HomeController extends Controller
{
    /**
     * Shop what to to in lc super awesome home page!
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function showIndex(Request $request)
    {
        $events = Event::visible()
            ->upcoming()
            ->orderBy('start_time')
            ->get();

        return view('home', compact('events'));
    }
}
