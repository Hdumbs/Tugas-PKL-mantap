<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Survey extends Model
{
    protected $fillable = [
        'user_id',
        'food_satisfaction',
        'service_quality',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
