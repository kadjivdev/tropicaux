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
use BcMath\Number;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $financementsAmount = Financement::whereNotNull("validated_at")->sum("montant");
        $fondSuperviseursAmount = FondSuperviseur::whereNotNull("validated_at")->sum("montant");
        $depensesSuperviseursAmount = DepenseSuperviseur::whereNotNull("validated_at")->sum("montant");

        $chargements = Chargement::all();
        $ventes = Vente::all();

        return Inertia::render('Dashboard', [
            "financementsAmount" => number_format($financementsAmount,2,","," "),
            "fondSuperviseursAmount" => number_format($fondSuperviseursAmount,2,","," "),
            "depensesSuperviseursAmount" => number_format($depensesSuperviseursAmount,2,","," "),
            "ventesAmount" => number_format($ventes->whereNotNull("validated_at")->sum("montant_total"),2,","," "),
            "chargements" => ChargementResource::collection($chargements),
            "ventes" => VenteResource::collection($ventes),
        ]);
    }
}
