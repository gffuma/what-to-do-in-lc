var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
  mix.sass('dashboard/app.scss', 'public/css/dashboard/app.css');
  mix.sass('dashboard/signin.scss', 'public/css/dashboard/signin.css');
  mix.scripts(['jquery.min.js', 'bootstrap.min.js'], 'public/js/dashboard/app.js');
});
