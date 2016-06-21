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
    // le Dashboard API
    Route::group(['prefix' => 'api', 'namespace' => 'Api'], function () {

        // Events...

        // Facebook...
        Route::get('events/fb', 'EventController@getFacebookEvents');
        Route::get('events/fb/{fbid}', 'EventController@getFacebookEvent');
        Route::post('events/fb', 'EventController@importFacebookEvent');
        Route::put('events/fb/{fbid}', 'EventController@updateImportedFacebookEvent');
        Route::delete('events/fb/{fbid}', 'EventController@deleteImportedFacebookEvent');

        // REST...
        Route::get('events', 'EventController@getEvents');
        Route::get('events/{event}', 'EventController@getEvent');
        Route::post('events', 'EventController@storeEvent');
        Route::put('events/{event}', 'EventController@updateEvent');
        Route::delete('events/{event}', 'EventController@deleteEvent');

        // Relation \w categories...
        Route::post('events/{event}/categories', 'EventController@addCategoriesToEvent');
        Route::put('events/{event}/categories', 'EventController@setEventCategories');
        Route::delete('events/{event}/categories/{category}', 'EventController@removeCategoryFromEvent');
        Route::delete('events/{event}/categories', 'EventController@removeAllCategoriesFromEvent');

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
