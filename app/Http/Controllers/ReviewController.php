<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Scan;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, string $code)
    {
        $scan = Scan::where('scan_code', $code)->firstOrFail();

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'recommended' => 'required|boolean',
            'comment' => 'nullable|string|max:1000',
        ]);

        Review::updateOrCreate(
            ['scan_id' => $scan->id],
            [
                'user_id' => auth()->id(),
                'rating' => $validated['rating'],
                'recommended' => $validated['recommended'],
                'comment' => $validated['comment'] ?? null,
            ]
        );

        return back()->with('success', 'Rating submitted successfully!');
    }
}
