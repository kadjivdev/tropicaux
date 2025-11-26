<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AllPermissionToSuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        $allPermissions = Permission::all();

        // Assigner le rôle de super administrateur à l'utilisateur avec l'ID 1
        $user = User::find(1);
        // if ($user) {
        //     $user->assignRole('Super Administrateur');
        // }

        // Attribution de toutes les permissions au super-admin
        // $superAdmin = Role::findByName('Super Administrateur');
        $user->syncPermissions($allPermissions);
    }
}
