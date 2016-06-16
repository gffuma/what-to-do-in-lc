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

    // Le dashboard api
    Route::group(['prefix' => 'api', 'namespace' => 'Api'], function () {

        Route::get('events/by-fb-ids/{fbids}', 'EventController@eventsByFacebookIds')
            ->where(['fbids' => '^[0-9]+(,[0-9]+)*$']);

        Route::post('events/import-from-fb/{fbid}', 'EventController@importEventFromFacebook');
    });

    // Serve reudx dashboard app
    Route::get('{route}', 'AppController@serve')
        ->where(['route' => '.*']);
});

// Frontend
Route::get('/', function() {
    return view('welcome');
});
