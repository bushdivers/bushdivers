<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\Mailer\Bridge\Mailjet\Transport\MailjetTransportFactory;
use Symfony\Component\Mailer\Transport\Dsn;

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

        Model::shouldBeStrict(!app()->isProduction());

        if (app()->isLocal() && class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(\App\Providers\TelescopeServiceProvider::class);
        }

        Mail::extend('mailjet', function (array $config) {
            // Construct the native Symfony Mailjet DSN string using your config keys
            $dsn = new Dsn(
                'mailjet+api',
                'default',
                $config['key'] ?? '',
                $config['secret'] ?? ''
            );

            // Instantiate the official Symfony Mailjet factory handler
            $factory = new MailjetTransportFactory();

            return $factory->create($dsn);
        });
    }
}
