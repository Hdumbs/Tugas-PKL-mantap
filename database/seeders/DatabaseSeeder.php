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
        $superAdmin = User::create([
            'name' => 'Dafha Super Admin',
            'email' => 'admin@amidyas.com',
            'password' => Hash::make('password123'),
            'role' => 'Super Admin',
            'status' => 'Active',
            'last_login_at' => now(),
        ]);

        $editor = User::create([
            'name' => 'Sarah Content Editor',
            'email' => 'editor@amidyas.com',
            'password' => Hash::make('password123'),
            'role' => 'Editor',
            'status' => 'Active',
            'last_login_at' => now()->subHours(2),
        ]);

        $viewer = User::create([
            'name' => 'Alex Analyst',
            'email' => 'viewer@amidyas.com',
            'password' => Hash::make('password123'),
            'role' => 'Viewer',
            'status' => 'Pending',
            'last_login_at' => null,
        ]);

        $customer = User::create([
            'name' => 'Jane Customer',
            'email' => 'customer@example.com',
            'password' => Hash::make('password123'),
            'role' => 'User',
            'status' => 'Active',
            'last_login_at' => now(),
        ]);

        // Sample 1: Grilled Salmon Quinoa Bowl
        $scan1 = Scan::create([
            'scan_code' => 'VG-SALMON1',
            'user_id' => $customer->id,
            'food_name' => 'Grilled Salmon Quinoa Bowl',
            'image_url' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85',
            'calories' => 420,
            'macronutrients' => [
                'protein' => '34g',
                'fats' => '14g',
                'carbs' => '42g',
                'sugar' => '4g',
                'fiber' => '8g',
                'sodium' => '380mg'
            ],
            'ingredients' => ['Fresh Atlantic Salmon', 'Organic Quinoa Base', 'Ripe Avocado', 'Cherry Tomatoes', 'Steamed Edamame'],
            'benefits' => [
                'Kaya akan Asam Lemak Omega-3 untuk kesehatan jantung dan otak.',
                'Sumber protein tinggi dan karbohidrat kompleks untuk energi stabil.',
                'Mengandung Vitamin C dan E sebagai antioksidan alami.'
            ],
            'ai_confidence' => 98.4,
            'latency_ms' => 210,
        ]);

        Review::create([
            'scan_id' => $scan1->id,
            'user_id' => $customer->id,
            'rating' => 5,
            'recommended' => true,
            'comment' => 'Salmon sangat gurih dan quinoa terasa sangat segar!',
        ]);

        Survey::create([
            'user_id' => $customer->id,
            'food_satisfaction' => 'Delicious',
            'service_quality' => 'Fast & Friendly',
        ]);

        // Sample 2: Creamy Macaroni & Cheese Bowl
        $scan2 = Scan::create([
            'scan_code' => 'VG-MACCHEESE',
            'user_id' => null,
            'food_name' => 'Creamy Macaroni & Cheese Gourmet Bowl',
            'image_url' => 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=85',
            'calories' => 520,
            'macronutrients' => [
                'protein' => '22g',
                'fats' => '24g',
                'carbs' => '54g',
                'sugar' => '5g',
                'fiber' => '4g',
                'sodium' => '620mg'
            ],
            'ingredients' => ['Elbow Macaroni', 'Sharp Cheddar Cheese', 'Mozzarella Melt', 'Fresh Herbs', 'Crispy Garlic Crumbs'],
            'benefits' => [
                'Sumber Kalsium tinggi mendukung kesehatan tulang dan gigi.',
                'Energi tinggi untuk pemulihan setelah latihan fisik.'
            ],
            'ai_confidence' => 97.2,
            'latency_ms' => 195,
        ]);

        Review::create([
            'scan_id' => $scan2->id,
            'user_id' => null,
            'rating' => 5,
            'recommended' => true,
            'comment' => 'Keju melimpah dan gurih banget!',
        ]);

        // Sample 3: Turkish Beef Kebab Wrap
        $scan3 = Scan::create([
            'scan_code' => 'VG-KEBAB01',
            'user_id' => $customer->id,
            'food_name' => 'Turkish Beef Kebab Tortilla Wrap',
            'image_url' => 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=85',
            'calories' => 480,
            'macronutrients' => [
                'protein' => '28g',
                'fats' => '18g',
                'carbs' => '50g',
                'sugar' => '4g',
                'fiber' => '6g',
                'sodium' => '490mg'
            ],
            'ingredients' => ['Soft Flatbread Wrap', 'Seasoned Beef Shavings', 'Fresh Crisp Lettuce', 'Sliced Tomatoes', 'Garlic Yogurt Dressing'],
            'benefits' => [
                'Protein daging sapi tinggi mendukung pembentukan massa otot.',
                'Karbohidrat kompleks dari tortilla memberi kenyang lebih lama.'
            ],
            'ai_confidence' => 98.8,
            'latency_ms' => 205,
        ]);

        Review::create([
            'scan_id' => $scan3->id,
            'user_id' => $customer->id,
            'rating' => 5,
            'recommended' => true,
            'comment' => 'Daging empuk dan saus garlic nya juara!',
        ]);
    }
}
