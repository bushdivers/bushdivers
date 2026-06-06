<?php

namespace App\Http\Controllers\Crew;

use App\Http\Controllers\Controller;
use App\Services\User\ResetCareer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ResetCareerController extends Controller
{
    protected ResetCareer $resetCareer;
    public function __construct(ResetCareer $resetCareer)
    {
        $this->resetCareer = $resetCareer;
    }
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $this->resetCareer->execute($request->user()->id);
        return redirect()->back()->with(['success' => 'Career reset successfully.']);
    }
}
