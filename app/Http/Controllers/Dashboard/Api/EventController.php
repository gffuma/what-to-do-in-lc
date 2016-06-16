<?php

namespace App\Http\Controllers\Dashboard\Api;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Event;

class EventController extends Controller
{
    /**
     * Events by facebook ids
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $fbIdsStr
     * @return \Illuminate\Http\Response
     */
    public function eventsByFacebookIds(Request $request, $fbIdsStr)
    {
        // Got list of requested facebook ids
        $fbIds = array_values(array_unique(explode(',', $fbIdsStr)));

        // Events by fbidS
        $events = Event::whereIn('fbid', $fbIds)->get();

        return $events->count() === 0
            ? response()->json((object)[]) // JSON {} instead of []
            : $events->keyBy('fbid');
    }

    /**
     * Import event from facebook
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $fbId
     * @return \Illuminate\Http\Response
     */
    public function importEventFromFacebook(Request $request, $fbId)
    {
        try {
            // Event alredy exist don't touch them...
            return Event::where('fbid', $fbId)->firstOrFail();
        } catch(ModelNotFoundException $e) {
            // Import event
            $this->validate($request, [
                'name' => 'required|max:255',
            ]);
            $createdEvent = Event::create(array_merge(['fbid' => $fbId], $request->only('name')));
            return response($createdEvent, 201); // Created :D
        }
    }
}
