<?php

namespace App\Http\Controllers\Dashboard\Api;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Event;
use App\Category;

class EventController extends Controller
{
    /**
     * List events
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getEvents(Request $request)
    {
        return Event::with('categories')->paginate();
    }

    /**
     * Get event
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $id
     * @return \Illuminate\Http\Response
     */
    public function getEvent(Request $request, $id)
    {
        return Event::findOrFail($id)->load('categories');
    }

    /**
     * Store event
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeEvent(Request $request)
    {
        //$ev
        // TODO: Implement...
    }

    /**
     * Delete event
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $id
     * @return \Illuminate\Http\Response
     */
    public function deleteEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id)->load('categories');
        $event->delete();
        return $event;
    }

    // TODO: Finish implementation
    public function addCategoriesToEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $this->validate($request, [
            'categories.*' => 'required|exists:categories,id'
        ]);
        // Ensure array
        $categoriesIds = $request->get('categories', []);
        $categoriesIds = is_array($categoriesIds) ? $categoriesIds : [];

        $categories = Category::whereIn('id', $categoriesIds)->get();
        $event->categories()->associate($categories);

        return $categories;
    }

    public function removeCategoryFromEvent()
    {
        // TODO: Implement
    }

    public function setEventCategories()
    {
        //$s
        // TODO: Implement
    }

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
        $events = Event::whereIn('fbid', $fbIds)->with('categories')->get();

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
            return Event::where('fbid', $fbId)->firstOrFail()->load('categories');
        } catch(ModelNotFoundException $e) {
            // Import event
            $this->validate($request, [
                'name' => 'required|max:255',
                'categories.*' => 'required|exists:categories,id'
            ]);
            $createdEvent = Event::create(array_merge(['fbid' => $fbId], $request->only(
                'name', 'description')));

            if (is_array($request->get('categories'))) {
                $createdEvent->categories()->sync($request->get('categories', []));
            }

            return response($createdEvent->load('categories'), 201); // Created :D
        }
    }
}
