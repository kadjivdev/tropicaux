<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Detail>
 */
class DetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $table = "users_details";

    public function definition(): array
    {
        return [
            "phone" => fake()->phoneNumber(),
            "profile_img" => fake()->imageUrl(),
            "statut" => fake()->boolean()
        ];
    }
}
