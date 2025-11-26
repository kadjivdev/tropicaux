<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class AddSomePermission extends Seeder
{
    private function createCrudValidatePermissions($name, $permission)
    {
        return [
            "Voir les $name" => "$permission.view",
            "Créer des $name" => "$permission.create",
            "Modifier les $name" => "$permission.edit",
            "Supprimer des $name" => "$permission.delete",
            "Valider les $name" => "$permission.validate",
        ];
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions_groups = [
            ["Transferer un pré-financement" => "prefinancement.transfert"]
        ];

        foreach ($permissions_groups as $permission) {
            foreach ($permission as $description => $name) {
                Permission::create(
                    ['name' => $name, 'group_name' => 'pré-financement', 'description' => $description]
                );
            }
        }
    }
}
