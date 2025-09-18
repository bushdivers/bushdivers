<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('boolstring', function ($attribute, $value, $parameters, $validator) {
            return in_array(strtolower($value), ['true', 'false']);
        }, 'The :attribute field must be string "true" or "false".');
    }
}
