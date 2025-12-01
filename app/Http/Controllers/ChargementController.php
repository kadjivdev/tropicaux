<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChargementResource;
use App\Models\Camion;
use App\Models\Chargement;
use App\Models\Chauffeur;
use App\Models\Convoyeur;
use App\Models\Fournisseur;
use App\Models\Magasin;
use App\Models\Produit;
use App\Models\Superviseur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;

class ChargementController extends Controller
{
    /**
     * Liste des chargments
     */

    function index()
    {
        $sessionId = Session::get("campagne")?->id;
        $chargements = Chargement::where("campagne_id", $sessionId)->get();
        
        return inertia("Chargements/List", [
            "chargements" => ChargementResource::collection($chargements)
        ]);
    }


    /**
     * Formulaire de création
     */
    function create()
    {
        $produits = Produit::all();
        $superviseurs = Superviseur::all();
        $convoyeurs = Convoyeur::all();
        $magasins = Magasin::all();
        $chauffeurs = Chauffeur::all();
        $fournisseurs = Fournisseur::all();
        $camions = Camion::all();

        return inertia("Chargements/Create", [
            "produits" => $produits,
            "chauffeurs" => $chauffeurs,
            "superviseurs" => $superviseurs,
            "convoyeurs" => $convoyeurs,
            "magasins" => $magasins,
            "fournisseurs" => $fournisseurs,
            "camions" => $camions,
        ]);
    }

    /**
     * Enregistrement d'un financement
     */
    function store(Request $request)
    {
        Log::debug("Les donnéees entrantes", [$request->all()]);

        $validated = $request->validate([
            "produit_id" => ["required", "integer"],
            "chauffeur_id" => ["required", "integer"],
            "superviseur_id" => ["required", "integer"],
            "convoyeur_id" => ["nullable", "integer"],
            // "magasin_id" => ["required", "integer"],
            "adresse" => ["required"],
            "observation" => ["nullable"],

            "details" => ["required", "array"],
            "camions" => ["required", "array"],
        ], [
            "produit_id.required" => "Le produit est requis.",
            "produit_id.integer" => "Le produit doit être un entier.",

            "chauffeur_id.required" => "Le chauffeur est requis.",
            "chauffeur_id.integer" => "Le chauffeur doit être un entier.",

            "superviseur_id.required" => "Le superviseur est requis.",
            "superviseur_id.integer" => "Le superviseur doit être un entier.",

            // "convoyeur_id.required" => "Le convoyeur est requis.",
            "convoyeur_id.integer" => "Le convoyeur doit être un entier.",

            // "magasin_id.required" => "Le magasin est requis.",
            "magasin_id.integer" => "Le magasin doit être un entier.",

            "adresse.required" => "L’adresse est requise.",

            "details.required" => "Ajouter au moins un détail",
            "details.array" => "Les détails doivent être un tableau",

            "camions.required" => "Ajouter au moins un camion",
            "camions.array" => "Les camions doivent être un tableau",
        ]);

        try {
            DB::beginTransaction();
            $chargement = Chargement::create($validated);

            // Détail du chargement
            $chargement->details()
                ->createMany($validated["details"]);

            // Camions du chargement
            $chargement->camions()
                ->createMany($validated["camions"]);

            DB::commit();
            Log::info("Nouveau Chargement créé avec succès", ["chargement_id" => $chargement->id, "created_by" => auth()->user()->id]);
            return redirect()->route("chargement.index");
        } catch (ValidationException $e) {
            Log::debug("Erreure lors de la création du chargement", ["error" => $e->errors()]);
            DB::rollBack();
            return back()->withErrors(["error" => $e->errors()]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création du chargement", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du chargement :" . $e->getMessage()]);
        }
    }


    /**
     * Edit
     */
    function edit(Chargement $chargement)
    {
        $produits = Produit::all();
        $superviseurs = Superviseur::all();
        $convoyeurs = Convoyeur::all();
        $magasins = Magasin::all();
        $chauffeurs = Chauffeur::all();
        $fournisseurs = Fournisseur::all();
        $camions = Camion::all();

        return inertia("Chargements/Update", [
            'chargement' => $chargement->load(["camions", "details"]),
            "produits" => $produits,
            "chauffeurs" => $chauffeurs,
            "superviseurs" => $superviseurs,
            "convoyeurs" => $convoyeurs,
            "magasins" => $magasins,
            "fournisseurs" => $fournisseurs,
            "camions" => $camions,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Chargement $chargement)
    {
        Log::debug("Les donnéees entrantes", [$request->all()]);

        $validated = $request->validate([
            "produit_id" => ["required", "integer"],
            "chauffeur_id" => ["required", "integer"],
            "superviseur_id" => ["required", "integer"],
            "convoyeur_id" => ["nullable", "integer"],
            "magasin_id" => ["required", "integer"],
            "adresse" => ["required"],
            "observation" => ["nullable"],

            "details" => ["required", "array"],
            "camions" => ["required", "array"],
        ], [
            "produit_id.required" => "Le produit est requis.",
            "produit_id.integer" => "Le produit doit être un entier.",

            "chauffeur_id.required" => "Le chauffeur est requis.",
            "chauffeur_id.integer" => "Le chauffeur doit être un entier.",

            "superviseur_id.required" => "Le superviseur est requis.",
            "superviseur_id.integer" => "Le superviseur doit être un entier.",

            // "convoyeur_id.required" => "Le convoyeur est requis.",
            "convoyeur_id.integer" => "Le convoyeur doit être un entier.",

            "magasin_id.required" => "Le magasin est requis.",
            "magasin_id.integer" => "Le magasin doit être un entier.",

            "adresse.required" => "L’adresse est requise.",

            "details.required" => "Ajouter au moins un détail",
            "details.array" => "Les détails doivent être un tableau",

            "camions.required" => "Ajouter au moins un camion",
            "camions.array" => "Les camions doivent être un tableau",
        ]);

        try {
            DB::beginTransaction();

            //updating
            $chargement->update($validated);

            //suppression des anciennes insertions
            $chargement->details()->delete();
            $chargement->camions()->delete();

            /**Nouvelles insertion */

            // Détail du chargement
            $chargement->details()
                ->createMany($validated["details"]);

            // Camions du chargement
            $chargement->camions()
                ->createMany($validated["camions"]);

            DB::commit();
            Log::info("Chargement modifié avec succès", ["chargement_id" => $chargement->id, "created_by" => auth()->user()->id]);
            return redirect()->route("chargement.index");
        } catch (ValidationException $e) {
            Log::debug("Erreure lors de la modification du chargement", ["error" => $e->errors()]);
            DB::rollBack();
            return back()->withErrors(["error" => $e->errors()]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la modification du chargement", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de la modification du chargement :" . $e->getMessage()]);
        }
    }

    /**
     * Validation
     */
    function validatedChargement(Chargement $chargement)
    {
        try {
            DB::beginTransaction();

            if (!$chargement) {
                throw new \Exception("Ce chargement n'existe pas");
            }

            $chargement->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("chargement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la validation du chargements", ["error" => $e->errors()]);
            return back()->withErrors(["error" => $e->errors()]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la validation du chargements", ["error" => $e->getMessage()]);
            return back()->withErrors(["error" => $e->getMessage()]);
        }
    }

    /**
     * liste les fonds superviseurs
     */
    function fonds(Chargement $chargement)
    {
        $sessionId = Session::get("campagne")?->id;

        $chargement->load([
            "fonds" => fn($query) => $query->where("campagne_id", $sessionId),
            "fonds.createdBy",
            "fonds.superviseur",
            "fonds.validatedBy",
        ]);

        Log::debug("Le Chargement cponcerné :", ["data" => $chargement]);

        $total_amount = $chargement->fonds()->whereNotNull("validated_by")->sum("montant");

        return inertia("Chargements/Fonds", [
            'total_amount' => number_format($total_amount, 2, ",", " "),
            'chargement' => $chargement,
        ]);
    }

    /**
     * liste les depenses superviseurs
     */
    function depenses(Chargement $chargement)
    {
        $sessionId = Session::get("campagne")?->id;

        $chargement->load([
            "depenses" => fn($query) => $query->where("campagne_id", $sessionId),
            "depenses.createdBy",
            "depenses.superviseur",
            "depenses.validatedBy"
        ]);

        $total_amount = $chargement->depenses()->whereNotNull("validated_by")->sum("montant");

        return inertia("Chargements/Depenses", [
            'total_amount' => number_format($total_amount, 2, ",", " "),
            'chargement' => $chargement,
        ]);
    }

    /**
     * Destroy
     */
    function destroy(Chargement $chargement)
    {
        try {
            DB::beginTransaction();

            if (!$chargement) {
                throw new \Exception("Ce chargement n'existe pas");
            }
            $chargement->delete();

            DB::commit();
            return redirect()->route("chargement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du chargement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du chargement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
