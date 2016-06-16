<?php

namespace App\Http\Controllers\Dashboard;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class AppController extends Controller
{
    /**
     * Serve redux dashboard with endless love
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function serve(Request $request)
    {
        // Redux store initial state
        $initialState = [
            'fb' => [
                'app' => [
                    'id' => env('FACEBOOK_APP_ID'),
                    'secret' => env('FACEBOOK_APP_SECRET')
                ]
            ],
            'laravel' => [
                'csrfToken' => csrf_token()
            ]
        ];

        // Webpack bundle
        $bundleSrc =  env('APP_ENV') === 'production'
            ? url('/dist/bundle.js') // Static file
            : 'http://localhost:3000/dist/bundle.js'; // HMR

        return view('dashboard/react_app', compact('initialState', 'bundleSrc'));
    }
}
