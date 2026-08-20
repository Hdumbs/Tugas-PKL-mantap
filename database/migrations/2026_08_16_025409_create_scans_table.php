<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('scans', function (Blueprint $table) {
            $table->id();
            $table->string('scan_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('food_name');
            $table->text('image_url')->nullable();
            $table->integer('calories')->default(0);
            $table->json('macronutrients')->nullable(); // {protein: '25g', fats: '14g', carbs: '45g', sugar: '6g'}
            $table->json('ingredients')->nullable(); // ['Quinoa Base', 'Grilled Salmon', ...]
            $table->json('benefits')->nullable(); // ['Rich in Omega-3', ...]
            $table->float('ai_confidence')->default(95.0);
            $table->integer('latency_ms')->default(250);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scans');
    }
};
