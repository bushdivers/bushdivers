<?php

namespace App\Http\Controllers\Rentals;

use App\Http\Controllers\Controller;
use App\Services\Rentals\EndRental;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EndRentalController extends Controller
{
    protected EndRental $endRental;

    public function __construct(EndRental $endRental)
    {
        $this->endRental = $endRental;
    }

    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, $id): RedirectResponse
    {
        $this->endRental->execute($id, Auth::user()->id);
        return redirect()->back()->with(['success' => 'Aircraft has been returned']);
    }
}
