<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// Dashboard
Route::group(['domain' => env('DASHBOARD_DOMAIN'), 'namespace' => 'Dashboard'], function () {

    // TODO: Handle exception with json in API
    // Le dashboard api
    Route::group(['prefix' => 'api', 'namespace' => 'Api'], function () {

        // Events...
        Route::get('events', 'EventController@getEvents');
        Route::get('events/{event}', 'EventController@getEvent');
        //Route::post('events', 'EventController@storeEvent');
        //Route::put('events/{event}', 'EventController@updateEvent');
        Route::delete('events/{event}', 'EventController@deleteEvent');
        Route::post('events/{event}/categories', 'EventController@addCategoriesToEvent');
        Route::get('events/by-fbids/{fbids}', 'EventController@eventsByFacebookIds')
            ->where(['fbids' => '^[0-9]+(,[0-9]+)*$']);
        Route::post('events/import-from-fb/{fbid}', 'EventController@importEventFromFacebook');

        // Categories...
        Route::get('categories', 'CategoryController@getCategories');
        Route::get('categories/{category}', 'CategoryController@getCategory');
        Route::post('categories', 'CategoryController@storeCategory');
        Route::put('categories/{category}', 'CategoryController@updateCategory');
        Route::delete('categories/{category}', 'CategoryController@deleteCategory');
    });

    // TODO: Better regex for only sense paths
    // Serve reudx dashboard app
    Route::get('{route}', 'AppController@serve')
        ->where(['route' => '.*']);
});

// Frontend
Route::get('/', function() {
    return view('welcome');
});
