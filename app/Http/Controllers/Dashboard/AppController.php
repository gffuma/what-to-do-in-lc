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
        $bundleSrc =  env('WEBPACK_HMR')
            ? 'http://localhost:3000/dist/bundle.js' // HMR
            : url('/dist/bundle.js'); // Static file

        // Num of thunders to show while react load
        $thunders = rand(3, 30);

        return view('dashboard/react_app', compact('initialState', 'bundleSrc', 'thunders'));
    }
}
