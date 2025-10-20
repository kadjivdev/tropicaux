<?php

namespace Database\Seeders;

use App\Models\Classe;
use App\Models\Matiere;
use App\Models\Serie;
use App\Models\Trimestre;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

         /**
         * Users
         */
        $user = User::factory()->create([
            'firstname' => 'Admin',
            'lastname' => 'Tropicaux',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin@2025'), // mot de passe par défaut
        ]);

        $user->detail()->create([
            "phone" => "+2290156854397",
            "profile_img" => asset("fichisers/images/logo.png"),
        ]);

        /**
         * Les roles & permissions
         */
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            ModePaiementSeeder::class,
            AllPermissionToSuperAdminSeeder::class
        ]);
    }
}
