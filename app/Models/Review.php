<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'scan_id',
        'user_id',
        'rating',
        'recommended',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
        'recommended' => 'boolean',
    ];

    public function scan(): BelongsTo
    {
        return $this->belongsTo(Scan::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
