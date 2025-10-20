<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepenseResource;
use App\Models\Chargement;
use App\Models\DepenseSuperviseur;
use App\Models\Superviseur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DepenseSuperviseurController extends Controller
{
    /**
     * Liste des depenses aux superviseurs
     */

    function index()
    {
        $depenses = DepenseSuperviseur::all();
        return inertia("Depenses/List", [
            "fonds" => DepenseResource::collection($depenses)
        ]);
    }

    /**
     * Formulaire de création
     */
    function create()
    {
        $chargements = Chargement::all();
        $superviseurs = Superviseur::all();

        return inertia("Depenses/Create", [
            "chargements" => $chargements,
            "superviseurs" => $superviseurs,
        ]);
    }

    /**
     * Enregistrement d'un fond
     */
    function store(Request $request)
    {
        $validated = $request->validate([
            "chargement_id" => ["required", "integer"],
            "superviseur_id" => ["required", "integer"],
            "montant" => ["required", "numeric"],
            "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
            "commentaire" => ["nullable"],
        ], [
            "chargement_id.required" => "Le chargement est requis.",
            "chargement_id.integer" => "Le chargement doit être un entier.",

            "superviseur_id.required" => "Le superviseur est requis.",
            "superviseur_id.integer" => "Le superviseur doit être un entier.",

            "montant.required" => "Le montant est requis.",
            "montant.numeric" => "Le montant doit être un nombre.",

            "document.file" => "Le document doit être un fichier.",
            "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",
        ]);

        try {
            DB::beginTransaction();
            $depense = DepenseSuperviseur::create($validated);

            DB::commit();
            Log::info("Nouveau fond créé avec succès", ["fond_id" => $depense->id, "created_by" => auth()->user()->id]);
            return redirect()->route("depense.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création du depense", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du fond"]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création du depense", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du depense"]);
        }
    }


    /**
     * Edit
     */
    function edit(DepenseSuperviseur $depense)
    {
        return inertia("Depenses/Update", [
            'fond' => $depense,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, DepenseSuperviseur $depense)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                "chargement_id" => ["required", "integer"],
                "superviseur_id" => ["required", "integer"],
                "montant" => ["required", "numeric"],
                "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
                "commentaire" => ["nullable"],
            ], [
                "chargement_id.required" => "Le chargement est requis.",
                "chargement_id.integer" => "Le chargement doit être un entier.",

                "superviseur_id.required" => "Le superviseur est requis.",
                "superviseur_id.integer" => "Le superviseur doit être un entier.",

                "montant.required" => "Le montant est requis.",
                "montant.numeric" => "Le montant doit être un nombre.",

                "document.file" => "Le document doit être un fichier.",
                "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",
            ]);

            DB::beginTransaction();

            $depense->update($validated);

            DB::commit();
            return redirect()->route("depense-superviseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du depense superviseur", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du depense superviseur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Validation
     */
    function validatedDepense(DepenseSuperviseur $depense)
    {
        try {
            DB::beginTransaction();

            if (!$depense) {
                throw new \Exception("Cette dépense n'existe pas");
            }

            $depense->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("depense-superviseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la dépense", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la dépense", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(DepenseSuperviseur $depense)
    {
        try {
            DB::beginTransaction();

            if (!$depense) {
                throw new \Exception("Cette dépense n'existe pas");
            }
            $depense->delete();

            DB::commit();
            return redirect()->route("depense-superviseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la dépense", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la dépense", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
