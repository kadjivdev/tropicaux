<?php

use App\Http\Controllers\ApprenantController;
use App\Http\Controllers\BulletinController;
use App\Http\Controllers\CamionController;
use App\Http\Controllers\CampagneController;
use App\Http\Controllers\CampagneSession;
use App\Http\Controllers\ChargementController;
use App\Http\Controllers\ChauffeurController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\ConvoyeurController;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepenseSuperviseurController;
use App\Http\Controllers\DevoirController;
use App\Http\Controllers\FinancementBackController;
use App\Http\Controllers\FinancementController;
use App\Http\Controllers\FondSuperviseurController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\InterrogationController;
use App\Http\Controllers\MagasinController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\MoyenneDevoirController;
use App\Http\Controllers\MoyenneInterrogationController;
use App\Http\Controllers\PaiementModeController;
use App\Http\Controllers\PartenaireController;
use App\Http\Controllers\PayementController;
use App\Http\Controllers\PreFinancementController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\SerieController;
use App\Http\Controllers\SuperviseurController;
use App\Http\Controllers\TrimestreController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VenteController;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/{roleId}/affect-permissions", function ($roleId) {

    $role = Role::findOrFail($roleId);

    if (!$role) {
        return "Ce role n'existe pas";
    }
    $permissions = Permission::all();
    $role->syncPermissions($permissions->pluck("name"));
    return "Permissions affectées avec succès";
});

Route::redirect('/', '/login');

Route::middleware('auth')->group(function () {

    // Campagnes
    Route::resource("campagne", CampagneController::class);
    // Initiation d'une campagne dans un session
    Route::get("/campagne-session/{campagne}", [CampagneSession::class, "campagneSession"])->name("campagneSession");

    Route::middleware("campagne.session")->group(function () {
        Route::get('/dashboard', DashboardController::class)->middleware(['verified'])->name('dashboard');

        /**
         * LES GESTIONS
         */
        // Pré Financements
        Route::resource("prefinancement", PreFinancementController::class);
        Route::patch("/prefinancement/{prefinancement}/validate", [PreFinancementController::class, "validatedPreFinancement"])->name("prefinancement.validate");
        Route::post("/prefinancement/{prefinancement}/transfert-reste", [PreFinancementController::class, "transfertReste"])->name("prefinancement.transfert-reste");


        // Financements
        Route::resource("financement", FinancementController::class);
        Route::patch("/financement/{financement}/validate", [FinancementController::class, "validatedFinancement"])->name("financement.validate");

        // Retour des Financements
        Route::resource("backfinancement", FinancementBackController::class);
        Route::patch("/backfinancement/{backfinancement}/validate", [FinancementBackController::class, "validatedFinancementBack"])->name("backfinancement.validate");

        // Fournisseur
        Route::resource("fournisseur", FournisseurController::class);
        Route::get("fournisseur/{fournisseur}/financements", [FournisseurController::class, "financements"])->name("fournisseur.financements");

        // Chargements
        Route::resource("chargement", ChargementController::class);
        Route::patch("/chargement/{chargement}/validate", [ChargementController::class, "validatedChargement"])->name("chargement.validate");
        Route::get("chargement/{chargement}/fonds", [ChargementController::class, "fonds"])->name("chargement.fonds");
        Route::get("chargement/{chargement}/depenses", [ChargementController::class, "depenses"])->name("chargement.depenses");

        // Fonds aux superviseur
        Route::resource("fond-superviseur", FondSuperviseurController::class);
        Route::patch("/fond-superviseur/{fond}/validate", [FondSuperviseurController::class, "validatedFond"])->name("fond-superviseur.validate");

        // Dépenses superviseur
        Route::resource("depense-superviseur", DepenseSuperviseurController::class);
        Route::patch("/depense-superviseur/{depense}/validate", [DepenseSuperviseurController::class, "validatedDepense"])->name("depense-superviseur.validate");

        // Partenanires
        Route::resource("partenaire", PartenaireController::class);
        Route::get("partenaire/{partenaire}/ventes", [PartenaireController::class, "ventes"])->name("partenaire.ventes");

        // Ventes
        Route::resource("vente", VenteController::class);
        Route::patch("/vente/{vente}/validate", [VenteController::class, "validatedVente"])->name("vente.validate");

        // Profils utilisateurs
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        /***
         * LES PARAMETRAGES
         */

        // Users
        Route::resource("user", UserController::class);

        // Roles
        Route::resource("role", RoleController::class)->except("update");
        Route::get("role/{id}/permissions", [RoleController::class, 'getPermissions'])->name("role.permissions");
        Route::get("role/{id}/users", [RoleController::class, 'getUsers'])->name("role.users");
        Route::post("role/affect", [RoleController::class, 'affectRole'])->name("affect.role");
        Route::post("role/{id}/update-permissions", [RoleController::class, 'updatePermissions'])->name("role.update.permissions");
        Route::post("role/{id}/update-users", [RoleController::class, 'updateUsers'])->name("role.update.users");

        // Mode de paiement
        Route::resource("mode-paiement", PaiementModeController::class);

        // Produits
        Route::resource("produit", ProduitController::class);

        // Camions
        Route::resource("camion", CamionController::class);

        // Chauffeurs
        Route::resource("chauffeur", ChauffeurController::class);

        // Superviseurs
        Route::resource("superviseur", SuperviseurController::class);

        // Magasins
        Route::resource("magasin", MagasinController::class);

        // Convoyeurs
        Route::resource("convoyeur", ConvoyeurController::class);
    });
});

require __DIR__ . '/auth.php';
