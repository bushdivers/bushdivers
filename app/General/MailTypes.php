<?php

namespace App\General;

class MailTypes
{
    public static function register($user)
    {
        $data = [
            'name' => $user->name,
            'pilot_id' => $user->pilot_id
        ];
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "admin@bushdivers.com",
                        'Name' => "Bush Divers Team"
                    ],
                    'To' => [
                        [
                            'Email' => $user->email,
                            'Name' => $user->name
                        ]
                    ],
                    'TemplateID' => 3180087,
                    'TemplateLanguage' => true,
                    'Subject' => "Welcome to Bush Divers",
                    'Variables' => $data
//                    'Variables' => json_decode('{
//                        "name": "",
//                        "pilot_id": ""
//                      }', true)
                ]
            ]
        ];

        return $body;
    }

    public static function passwordRequest($user, $link)
    {
        $data = [
            'name' => $user->name,
            'url' => $link
        ];
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "admin@bushdivers.com",
                        'Name' => "Bush Divers Team"
                    ],
                    'To' => [
                        [
                            'Email' => $user->email,
                            'Name' => $user->name
                        ]
                    ],
                    'TemplateID' => 3180120,
                    'TemplateLanguage' => true,
                    'Subject' => "Password Reset Request",
                    'Variables' => $data
//                    'Variables' => json_decode('{
//                        "name": "",
//                        "url":$link
//                    }', true)
                ]
            ]
        ];

        return $body;
    }

    public static function passwordReset($user)
    {
        $data = [
            'name' => $user->name
        ];

        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "admin@bushdivers.com",
                        'Name' => "Bush Divers Team"
                    ],
                    'To' => [
                        [
                            'Email' => $user->email,
                            'Name' => $user->name
                        ]
                    ],
                    'TemplateID' => 3180260,
                    'TemplateLanguage' => true,
                    'Subject' => "Password Reset Request",
                    'Vairables' => $data
                ]
            ]
        ];

        return $body;
    }
}
