<?php

namespace App\Http\Controllers;

use App\Http\Resources\VenteResource;
use App\Models\Camion;
use App\Models\Chargement;
use App\Models\PaiementMode;
use App\Models\Partenaire;
use App\Models\Vente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class VenteController extends Controller
{
    /**
     * Liste des ventes
     */

    function index()
    {
        $sessionId = Session::get("campagne")?->id;
        $ventes = Vente::where("campagne_id", $sessionId)->get();
        $chargements = Chargement::with("camions")
            ->where("campagne_id", $sessionId)
            ->whereNotNull("validated_by")
            ->get();

        return inertia("Ventes/List", [
            "ventes" => VenteResource::collection($ventes),
            "chargements"=>$chargements
        ]);
    }

    /**
     * Formulaire de création
     */
    function create()
    {
        $partenaires = Partenaire::all();
        $modes = PaiementMode::all();
        $camions = Camion::all();

        $sessionId = Session::get("campagne")?->id;
        $chargements = Chargement::with("camions")
            ->where("campagne_id", $sessionId)
            ->whereNotNull("validated_by")
            ->get();

        return inertia("Ventes/Create", [
            "partenaires" => $partenaires,
            "modes" => $modes,
            "camions" => $camions,
            "chargements" => $chargements,
        ]);
    }

    /**
     * Enregistrement d'un fond
     */
    function store(Request $request)
    {
        Log::debug("Les données entrante", ["data" => $request->all()]);

        $validated = $request->validate([
            "partenaire_id" => ["required", "integer"],
            "chargement_id" => ["required", "integer"],
            "prix" => ["required", "numeric"],
            // "montant" => ["required", "numeric"],
            "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],

            "poids" => ["required", "numeric"],
            "nbre_sac_rejete" => ["nullable", "numeric"],
            "prix_unitaire_sac_rejete" => ["nullable", "numeric"],

            "commentaire" => ["nullable"],

            "camions" => ["required", "array"],
            "modes" => ["required", "array"],
        ], [
            "partenaire_id.required" => "Le partenaire est requis.",
            "partenaire_id.integer" => "Le partenaire doit être un entier.",

            "chargement_id.required" => "Le chargement est requis.",
            "chargement_id.integer" => "Le chargement doit être un entier.",

            "prix.required" => "Le prix est requis.",
            "prix.numeric" => "Le prix doit être un nombre.",

            // "montant.required" => "Le montant est requis.",
            // "montant.numeric" => "Le montant doit être un nombre.",

            "document.file" => "Le document doit être un fichier.",
            "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",

            "poids.required" => "Le poids est requis.",
            "poids.numeric" => "Le poids doit être un nombre.",

            "nbre_sac_rejete.required" => "Le nombre de sacs rejetés est requis.",
            "nbre_sac_rejete.numeric" => "Le nombre de sacs rejetés doit être un nombre.",

            "prix_unitaire_sac_rejete.required" => "Le prix unitaire du sac rejeté est requis.",
            "prix_unitaire_sac_rejete.numeric" => "Le prix unitaire du sac rejeté doit être un nombre.",

            // "montant_total.required" => "Le montant total est requis.",
            // "montant_total.numeric" => "Le montant total doit être un nombre.",

            "camions.required" => "Ajouter au moins un camion",
            "camions.array" => "Les camions doivent être un tableau",

            "modes.required" => "Ajouter au moins un mode de paiement",
            "modes.array" => "Les modes de paiements doivent être un tableau",
        ]);

        try {
            DB::beginTransaction();
            $vente = Vente::create($validated);

            /**les camions */
            $vente->camions()->createMany($validated["camions"]);

            /**les modes de paiements */
            $vente->modes()->createMany($validated["modes"]);

            DB::commit();
            Log::info("Nouvelle vente créé avec succès", ["vente_id" => $vente->id, "created_by" => auth()->user()->id]);
            return redirect()->route("vente.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création d'une vente", ["error" => $e->errors()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement d'une vente"]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création d'une vente", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement d'une vente'"]);
        }
    }

    /**
     * Edit
     */
    function edit(Vente $vente)
    {
        $partenaires = Partenaire::all();
        $modes = PaiementMode::all();
        $camions = Camion::all();

        $sessionId = Session::get("campagne")?->id;
        $chargements = Chargement::where("campagne_id", $sessionId)
            ->whereNotNull("validated_by")
            ->get();

        return inertia("Ventes/Update", [
            'vente' => $vente->load("camions", "modes"),
            "partenaires" => $partenaires,
            "modes" => $modes,
            "camions" => $camions,
            "chargements" => $chargements,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Vente $vente)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            Log::debug("Les données entrante", ["data" => $request->all()]);

            $validated = $request->validate([
                "partenaire_id" => ["required", "integer"],
                "prix" => ["required", "numeric"],
                "montant" => ["required", "numeric"],
                "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],

                "poids" => ["required", "numeric"],
                "nbre_sac_rejete" => ["nullable", "numeric"],
                "prix_unitaire_sac_rejete" => ["nullable", "numeric"],

                "commentaire" => ["nullable"],

                "camions" => ["required", "array"],
                "modes" => ["required", "array"],
            ], [
                "partenaire_id.required" => "Le partenaire est requis.",
                "partenaire_id.integer" => "Le partenaire doit être un entier.",

                "prix.required" => "Le prix est requis.",
                "prix.numeric" => "Le prix doit être un nombre.",

                "montant.required" => "Le montant est requis.",
                "montant.numeric" => "Le montant doit être un nombre.",

                "document.file" => "Le document doit être un fichier.",
                "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",

                "poids.required" => "Le poids est requis.",
                "poids.numeric" => "Le poids doit être un nombre.",

                "nbre_sac_rejete.required" => "Le nombre de sacs rejetés est requis.",
                "nbre_sac_rejete.numeric" => "Le nombre de sacs rejetés doit être un nombre.",

                "prix_unitaire_sac_rejete.required" => "Le prix unitaire du sac rejeté est requis.",
                "prix_unitaire_sac_rejete.numeric" => "Le prix unitaire du sac rejeté doit être un nombre.",

                // "montant_total.required" => "Le montant total est requis.",
                // "montant_total.numeric" => "Le montant total doit être un nombre.",

                "camions.required" => "Ajouter au moins un camion",
                "camions.array" => "Les camions doivent être un tableau",

                "modes.required" => "Ajouter au moins un mode de paiement",
                "modes.array" => "Les modes de paiements doivent être un tableau",
            ]);

            DB::beginTransaction();

            /**Updating */
            $vente->update($validated);

            /**Suppression des camions et modes olds */
            $vente->camions()->delete();
            $vente->modes()->delete();

            // Camions de la vente
            $vente->camions()
                ->createMany($validated["camions"]);

            // Modes de la vente
            $vente->modes()
                ->createMany($validated["modes"]);

            DB::commit();
            Log::info("Nouvelle vente créé avec succès", ["vente_id" => $vente->id, "created_by" => auth()->user()->id]);

            return redirect()->route("vente.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification d'une vente'", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification d'une vente'", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Validation
     */
    function validatedVente(Vente $vente)
    {
        try {
            DB::beginTransaction();

            if (!$vente) {
                throw new \Exception("Cette vente n'existe pas");
            }

            $vente->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("vente.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la vente", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la vente", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(Vente $vente)
    {
        try {
            DB::beginTransaction();

            if (!$vente) {
                throw new \Exception("Cette vente n'existe pas");
            }
            $vente->delete();

            DB::commit();
            return redirect()->route("vente.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la vente", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la vente", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
