<?php

namespace App\Http\Controllers;

//use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home', ['message' => 'Well, hello there!']);
    }
}
