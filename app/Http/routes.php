<?php

// Dashboard
Route::group(['domain' => env('DASHBOARD_DOMAIN'), 'namespace' => 'Dashboard'], function () {

    // TODO: Handle exception with json in API
    // TODO: Handle 401 with json
    // le Dashboard API
    Route::group(['prefix' => 'api', 'namespace' => 'Api', 'middleware' => 'auth'], function () {

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

    // Auth...
    Route::get('login', 'Auth\AuthController@showLoginForm');
    Route::post('login', 'Auth\AuthController@login');
    Route::get('logout', 'Auth\AuthController@logout');

    // TODO: Better regex for only sense paths
    // Serve reudx dashboard app
    Route::get('{route}', 'AppController@serve')
        ->where(['route' => '[a-z]*'])
        ->middleware(['auth']);
});

// Frontend
Route::group(['domain' => env('FRONTEND_DOMAIN')], function () {

    Route::get('/', 'HomeController@showIndex');
    Route::get('/_-_', 'EventController@showSecrets');

    //Route::get('/{category}', 'CategoryController@showIndexCategory');
    //Route::get('/{category}/weekend', 'CategoryController@showCategoryInWeekend');
});

