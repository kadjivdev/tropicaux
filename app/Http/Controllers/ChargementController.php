<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChargementResource;
use App\Models\Chargement;
use App\Models\Convoyeur;
use App\Models\Magasin;
use App\Models\Produit;
use App\Models\Superviseur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChargementController extends Controller
{
    /**
     * Liste des chargments
     */

    function index()
    {
        $chargements = Chargement::all();
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

        return inertia("Chargements/Create", [
            "produits" => $produits,
            "superviseurs" => $superviseurs,
            "convoyeurs" => $convoyeurs,
            "superviseurs" => $superviseurs,
            "magasins" => $magasins,
        ]);
    }

    /**
     * Enregistrement d'un financement
     */
    function store(Request $request)
    {
        $validated = $request->validate([
            "produit_id" => ["required", "integer"],
            "chauffeur_id" => ["required", "integer"],
            "superviseur_id" => ["required", "integer"],
            "convoyeur_id" => ["required", "integer"],
            "magasin_id" => ["required", "integer"],
            "adresse" => ["required", "numeric"],
            "observation" => ["nullable"],
        ], [
            "produit_id.required" => "Le produit est requis.",
            "produit_id.integer" => "Le produit doit être un entier.",

            "chauffeur_id.required" => "Le chauffeur est requis.",
            "chauffeur_id.integer" => "Le chauffeur doit être un entier.",

            "superviseur_id.required" => "Le superviseur est requis.",
            "superviseur_id.integer" => "Le superviseur doit être un entier.",

            "convoyeur_id.required" => "Le convoyeur est requis.",
            "convoyeur_id.integer" => "Le convoyeur doit être un entier.",

            "magasin_id.required" => "Le magasin est requis.",
            "magasin_id.integer" => "Le magasin doit être un entier.",

            "adresse.required" => "L’adresse est requise.",
            "adresse.numeric" => "L’adresse doit être une valeur numérique.",
        ]);

        try {
            DB::beginTransaction();
            $chargement = Chargement::create($validated);

            DB::commit();
            Log::info("Nouveau Chargement créé avec succès", ["chargement_id" => $chargement->id, "created_by" => auth()->user()->id]);
            return redirect()->route("chargement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création du chargement", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du chargement"]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création du chargement", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du chargement"]);
        }
    }


    /**
     * Edit
     */
    function edit(Chargement $chargement)
    {
        return inertia("Chargements/Update", [
            'chargement' => $chargement,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Chargement $chargement)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                "produit_id" => ["required", "integer"],
                "chauffeur_id" => ["required", "integer"],
                "superviseur_id" => ["required", "integer"],
                "convoyeur_id" => ["required", "integer"],
                "magasin_id" => ["required", "integer"],
                "adresse" => ["required", "numeric"],
                "observation" => ["nullable"],
            ], [
                "produit_id.required" => "Le produit est requis.",
                "produit_id.integer" => "Le produit doit être un entier.",

                "chauffeur_id.required" => "Le chauffeur est requis.",
                "chauffeur_id.integer" => "Le chauffeur doit être un entier.",

                "superviseur_id.required" => "Le superviseur est requis.",
                "superviseur_id.integer" => "Le superviseur doit être un entier.",

                "convoyeur_id.required" => "Le convoyeur est requis.",
                "convoyeur_id.integer" => "Le convoyeur doit être un entier.",

                "magasin_id.required" => "Le magasin est requis.",
                "magasin_id.integer" => "Le magasin doit être un entier.",

                "adresse.required" => "L’adresse est requise.",
                "adresse.numeric" => "L’adresse doit être une valeur numérique.",
            ]);

            DB::beginTransaction();

            $chargement->update($validated);

            DB::commit();
            return redirect()->route("chargement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du chargement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du chargement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
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
            Log::debug("Erreure lors de la suppression du chargements", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du chargements", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
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
            Log::debug("Erreure lors de la suppression du chargements", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du chargements", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
