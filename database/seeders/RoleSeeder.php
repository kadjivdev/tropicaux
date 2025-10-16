<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        // Création des rôles
        $roles = [
            'Super Administrateur',
            'Administrateur',
            'Fournisseur local',
            'Gestionnaire de fonds',
            'Chauffeur',
            'Superviseur',
            'Convoyeur',
            'Partenaire(client)',
        ];

        foreach ($roles as $role) {
            Role::create(["name" => $role, "guard_name" => "web"]);
        }
    }
}
