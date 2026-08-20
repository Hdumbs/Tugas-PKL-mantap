<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurveyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Survey');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'food_satisfaction' => 'nullable|string',
            'service_quality' => 'nullable|string',
        ]);

        Survey::create([
            'user_id' => auth()->id(),
            'food_satisfaction' => $validated['food_satisfaction'] ?? null,
            'service_quality' => $validated['service_quality'] ?? null,
        ]);

        return redirect()->route('scanner');
    }
}
