<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
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

    public function run(): void
    {
        $permissions_groups = [
            'Produits' => $this->createCrudValidatePermissions('produits', 'produit'),
            "Camions" => $this->createCrudValidatePermissions("camions", "camion"),
            "Chauffeurs" => $this->createCrudValidatePermissions("chauffeurs", "chauffeur"),
            "Superviseurs" => $this->createCrudValidatePermissions("superviseurs", "superviseur"),
            "Convoyeurs" => $this->createCrudValidatePermissions("convoyeurs", "convoyeur"),
            "Magasins" => $this->createCrudValidatePermissions("magasins", "magasin"),
            "Fournisseurs" => $this->createCrudValidatePermissions("fournisseurs", "fournisseur"),
            "Financements" => $this->createCrudValidatePermissions("financements", "financement"),
            "Chargements" => $this->createCrudValidatePermissions("chargements", "chargement"),
            "Fonds superviseur" => $this->createCrudValidatePermissions("fonds superviseur", "fond.superviseur"),
            "Depenses superviseur" => $this->createCrudValidatePermissions("dépenses superviseur", "depense.superviseur"),
            "Partenaire" => $this->createCrudValidatePermissions("partenaires", "partenaire"),
            "Vente" => $this->createCrudValidatePermissions("ventes", "vente"),
            "Mode de paiement" => $this->createCrudValidatePermissions("modes de paiement", "paiement.mode"),
            "Utilisateurs" => array_merge(
                $this->createCrudValidatePermissions("utilisateurs", "utilisateur"),
                ["Désactiver un utilisateur" => "desactiver.user"],
            ),
            "Rôles" => array_merge(
                ["Attribuer des roles aux utilisateurs" => "role.assign"],
                ["Attribuer des permissions aux rôles" => "permission.assign"],
                $this->createCrudValidatePermissions("rôles", "role"),
            )
        ];

        foreach ($permissions_groups as $group => $permissions) {
            foreach ($permissions as $description => $permission) {
                Permission::firstOrCreate(
                    ['name' => $permission, 'guard_name' => 'web'],
                    ['name' => $permission, 'group_name' => $group, 'description' => $description]
                );
            }
        }
    }
}
