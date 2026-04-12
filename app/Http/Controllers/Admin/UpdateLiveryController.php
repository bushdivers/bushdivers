<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateLiveryRequest;
use App\Models\Upload;
use Illuminate\Http\RedirectResponse;

class UpdateLiveryController extends Controller
{
    public function __invoke(UpdateLiveryRequest $request, int $id): RedirectResponse
    {
        $upload = Upload::findOrFail($id);

        $upload->display_name = $request->display_name;
        $upload->author = $request->author;
        $upload->sim_type = $request->sim_type ?? [];
        $upload->save();

        return redirect()->back()->with(['success' => 'Livery updated']);
    }
}
