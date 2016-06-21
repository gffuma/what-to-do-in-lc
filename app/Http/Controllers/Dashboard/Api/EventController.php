<?php

namespace App\Http\Controllers\Dashboard\Api;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Event;
use App\Category;
use Validator;

class EventController extends Controller
{
    /**
     * Get Faceboook events
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getFacebookEvents(Request $request)
    {
        // Got list of requested facebook ids...
        $fbids = array_values(array_unique(explode(',', $request->get('fbids', ''))));

        // 100 fbids max...
        if (count($fbids) > 100) {
            return response()->json([
                'error' => 'You can ask 100 fbids maximum per time.'
            ], 400);
        }

        // Filter by fbids...
        return Event::whereIn('fbid', $fbids)->with('categories')->get();
    }

    /**
     * Get Faceboook event
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $fbid
     * @return \Illuminate\Http\Response
     */
    public function getFacebookEvent(Request $request, $fbid)
    {
        return Event::where('fbid', $fbid)->firstOrFail()->load('categories');
    }

    /**
     * Import Facebook event
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function importFacebookEvent(Request $request)
    {
        // Check if fbid is alredy imported
        // And when event alredy exist don't touch them...
        if ($request->has('fbid')) {
            $alredyImportedEvent = Event::where('fbid', $request->get('fbid'))->first();
            if (!is_null($alredyImportedEvent)) {
                return $alredyImportedEvent->load('categories');
            }
        }

        // Import new event...
        $this->validate($request, [
            'fbid'         => 'required|max:100',
            'name'         => 'required|max:255',
            'cateogories'  => 'array',
            'categories.*' => 'required|exists:categories,id'
        ]);
        $newImportedEvent = Event::create($request->only('fbid', 'name', 'description'));

        if ($request->has('categories')) {
            $newImportedEvent->categories()->sync($request->get('categories', []));
        }

        return response($newImportedEvent->load('categories'), 201); // Created :D
    }

    /**
     * Update Facebook event
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $fbid
     * @return \Illuminate\Http\Response
     */
    public function updateImportedFacebookEvent(Request $request, $fbid)
    {
        $event = Event::where('fbid', $fbid)->firstOrFail();
        $this->validate($request, [
            'name' => 'required|max:255',
        ]);
        $event->fill($request->only('name', 'description'));
        $event->save();
        return $event->load('categories');
    }

    /**
     * Delete Facebook event
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $fbid
     * @return \Illuminate\Http\Response
     */
    public function deleteImportedFacebookEvent(Request $request, $fbid)
    {
        $event = Event::where('fbid', $fbid)->firstOrFail();
        $event->delete();

        return response(null, 204); // No Content
    }

    /**
     * List events
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getEvents(Request $request)
    {
        return Event::with('categories')->paginate(100);
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
        $this->validate($request, [
            'fbid'         => 'required|unique:events|max:100',
            'name'         => 'required|max:255',
            'cateogories'  => 'array',
            'categories.*' => 'required|exists:categories,id'
        ]);
        $newEvent = Event::create($request->only('fbid', 'name', 'description'));

        if ($request->has('categories')) {
            $newEvent->categories()->sync($request->get('categories', []));
        }

        return response($newEvent->load('categories'), 201); // Created :D
    }

    /**
     * Store event
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $id
     * @return \Illuminate\Http\Response
     */
    public function updateEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $this->validate($request, [
            'fbid' => 'required|unique:events,fbid,'.$event->id.'|max:100',
            'name' => 'required|max:255'
        ]);
        $event->fill($request->only('fbid', 'name', 'description'));
        $event->save();
        return $event->load('categories');
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
        $event = Event::findOrFail($id);
        $event->delete();
        return response(null, 204); // No Content
    }

    /**
     * Add event categories
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $id
     * @return \Illuminate\Http\Response
     */
    public function addCategoriesToEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $this->validate($request, [
            'categories'   => 'required|array',
            'categories.*' => 'required|exists:categories,id'
        ]);
        $categoriesIds = $request->get('categories', []);

        $event->categories()->sync($categoriesIds, false);

        return Category::whereIn('id', $categoriesIds)->get();
    }

    /**
     * Set event categories
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $id
     * @return \Illuminate\Http\Response
     */
    public function setEventCategories(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $this->validate($request, [
            'categories'   => 'required|array',
            'categories.*' => 'required|exists:categories,id'
        ]);
        $categoriesIds = $request->get('categories', []);

        $event->categories()->sync($categoriesIds);

        return Category::whereIn('id', $categoriesIds)->get();
    }

    /**
     * Remove category from event
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $id
     * @param  string                    $categoryId
     * @return \Illuminate\Http\Response
     */
    public function removeCategoryFromEvent(Request $request, $id, $categoryId)
    {
        $event = Event::findOrFail($id);
        $category = Category::findOrFail($categoryId);
        $event->categories()->detach($category);
        return response(null, 204);
    }

    /**
     * Remove all categories from event
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string                    $id
     * @return \Illuminate\Http\Response
     */
    public function removeAllCategoriesFromEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $event->categories()->detach();
        return response(null, 204);
    }
}
