<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Event;
use App\Category;

class EventController extends Controller
{
    /**
     * Show secrets events! Shhh
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function showSecrets(Request $request)
    {
        $categories = Category::secrets()
            ->with(['events' => function ($query) {
                $query
                    ->upcoming()
                    ->orderBy('start_time');
            }])
            ->get();

        return view('secrets', compact('categories'));
    }
}
