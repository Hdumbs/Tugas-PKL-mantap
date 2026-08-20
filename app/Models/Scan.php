<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Scan extends Model
{
    protected $fillable = [
        'scan_code',
        'user_id',
        'food_name',
        'image_url',
        'calories',
        'macronutrients',
        'ingredients',
        'benefits',
        'ai_confidence',
        'latency_ms',
    ];

    protected $casts = [
        'macronutrients' => 'array',
        'ingredients' => 'array',
        'benefits' => 'array',
        'ai_confidence' => 'float',
        'latency_ms' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $table_user = $this->belongsTo(User::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }
}
