<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Scan;
use App\Models\Review;
use App\Models\Survey;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@amidyas.com'],
            [
                'name' => 'Dafha Super Admin',
                'password' => Hash::make('password123'),
                'role' => 'Super Admin',
                'status' => 'Active',
                'last_login_at' => now(),
            ]
        );

        $editor = User::firstOrCreate(
            ['email' => 'editor@amidyas.com'],
            [
                'name' => 'Sarah Content Editor',
                'password' => Hash::make('password123'),
                'role' => 'Editor',
                'status' => 'Active',
                'last_login_at' => now()->subHours(2),
            ]
        );

        $viewer = User::firstOrCreate(
            ['email' => 'viewer@amidyas.com'],
            [
                'name' => 'Alex Analyst',
                'password' => Hash::make('password123'),
                'role' => 'Viewer',
                'status' => 'Pending',
                'last_login_at' => null,
            ]
        );

        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Jane Customer',
                'password' => Hash::make('password123'),
                'role' => 'User',
                'status' => 'Active',
                'last_login_at' => now(),
            ]
        );

        if (Scan::count() === 0) {
            $scan1 = Scan::create([
                'scan_code' => 'VG-' . Str::upper(Str::random(6)),
                'user_id' => $customer->id,
                'food_name' => 'Grilled Salmon Quinoa Bowl',
                'image_url' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
                'calories' => 420,
                'macronutrients' => [
                    'protein' => '32g',
                    'fats' => '14g',
                    'carbs' => '42g',
                    'sugar' => '4g',
                ],
                'ingredients' => ['Quinoa Base', 'Grilled Salmon', 'Avocado', 'Cherry Tomatoes', 'Edamame'],
                'benefits' => [
                    'High in Omega-3 fatty acids for heart and brain health.',
                    'Rich in complete protein and complex carbs for stable energy.',
                    'Contains antioxidant vitamin C and healthy fats.'
                ],
                'ai_confidence' => 96.5,
                'latency_ms' => 210,
            ]);

            Review::create([
                'scan_id' => $scan1->id,
                'user_id' => $customer->id,
                'rating' => 5,
                'recommended' => true,
                'comment' => 'Sangat segar dan porsi pas untuk diet!',
            ]);

            Survey::create([
                'user_id' => $customer->id,
                'food_satisfaction' => 'Delicious',
                'service_quality' => 'Fast & Friendly',
            ]);

            $scan2 = Scan::create([
                'scan_code' => 'VG-' . Str::upper(Str::random(6)),
                'user_id' => null,
                'food_name' => 'Avocado Chicken Salad',
                'image_url' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
                'calories' => 350,
                'macronutrients' => [
                    'protein' => '28g',
                    'fats' => '18g',
                    'carbs' => '18g',
                    'sugar' => '3g',
                ],
                'ingredients' => ['Chicken Breast', 'Avocado', 'Mixed Greens', 'Olive Oil Dressing'],
                'benefits' => [
                    'Low carb option rich in lean protein.',
                    'Provides monounsaturated fatty acids.'
                ],
                'ai_confidence' => 94.2,
                'latency_ms' => 190,
            ]);

            Review::create([
                'scan_id' => $scan2->id,
                'user_id' => null,
                'rating' => 4,
                'recommended' => true,
                'comment' => 'Ayam empuk, sayuran segar.',
            ]);
        }
    }
}
