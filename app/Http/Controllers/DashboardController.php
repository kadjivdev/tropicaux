<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApprenantResource;
use App\Http\Resources\ChargementResource;
use App\Http\Resources\InscriptionResource;
use App\Http\Resources\SchoolResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\VenteResource;
use App\Models\Apprenant;
use App\Models\Chargement;
use App\Models\DepenseSuperviseur;
use App\Models\Financement;
use App\Models\FondSuperviseur;
use App\Models\Inscription;
use App\Models\School;
use App\Models\User;
use App\Models\Vente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $financementsAmount = Financement::get()->sum("montant");
        $fondSuperviseursAmount = FondSuperviseur::get()->sum("montant");
        $depensesSuperviseursAmount = DepenseSuperviseur::get()->sum("montant");

        $chargements = Chargement::all();
        $ventes = Vente::all();

        return Inertia::render('Dashboard', [
            "financementsAmount" => $financementsAmount,
            "fondSuperviseursAmount" => $fondSuperviseursAmount,
            "depensesSuperviseursAmount" => $depensesSuperviseursAmount,
            "ventesAmount" => $ventes->sum("montant_total"),
            "chargements" => ChargementResource::collection($chargements),
            "ventes" => VenteResource::collection($ventes),
        ]);
    }
}
