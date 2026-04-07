<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChargementResource;
use App\Http\Resources\VenteResource;
use App\Models\Chargement;
use App\Models\DepenseSuperviseur;
use App\Models\Financement;
use App\Models\FondSuperviseur;
use App\Models\GeneralDepense;
use App\Models\Vente;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $sessionId = Session::get("campagne")?->id;
        Log::debug("La session concernée :", ["session" => Session::get("campagne")?->id]);

        $financementsAmount = Financement::where("campagne_id", $sessionId)
            ->whereNull("financement_id") // on fait l'exception des financements issus des transferts
            ->whereNotNull("validated_at")
            ->sum("montant");
        $depensesSuperviseursAmount = DepenseSuperviseur::where("campagne_id", $sessionId)->whereNotNull("validated_at")->sum("montant");
        $depensesGeneralesAmount = GeneralDepense::where("campagne_id", $sessionId)->whereNotNull("validated_at")->sum("montant");
        $chargementsAmount = Chargement::where("campagne_id", $sessionId)->whereNotNull("validated_at")->get()->sum(fn($ch) => $ch->total_amount);

        $chargements = Chargement::where("campagne_id", $sessionId)
            ->whereBetween("created_at", [now()->startOfWeek(), now()->startOfWeek()])
            ->get();

        $weekVentes = Vente::where("campagne_id", $sessionId)
            ->whereBetween("created_at", [now()->startOfWeek(), now()->startOfWeek()])
            ->get();

        $ventes = Vente::where("campagne_id", $sessionId)->get();

        $globalAmount = $chargementsAmount + $depensesSuperviseursAmount;

        return Inertia::render('Dashboard', [
            "financementsAmount" => number_format($financementsAmount, 2, ",", " "),
            "globalAmount" => number_format($globalAmount, 2, ",", " "),
            "depensesSuperviseursAmount" => number_format($depensesSuperviseursAmount, 2, ",", " "),
            "depensesGeneralesAmount" => number_format($depensesGeneralesAmount, 2, ",", " "),
            "ventesAmount" => number_format($ventes->whereNotNull("validated_at")->sum("montant_total"), 2, ",", " "),
            "chargements" => ChargementResource::collection($chargements),
            "ventes" => VenteResource::collection($weekVentes),
        ]);
    }
}
