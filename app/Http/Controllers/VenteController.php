<?php

namespace App\Http\Controllers;

use App\Http\Resources\VenteResource;
use App\Models\Partenaire;
use App\Models\Vente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VenteController extends Controller
{
    /**
     * Liste des ventes
     */

    function index()
    {
        $ventes = Vente::all();
        return inertia("Ventes/List", [
            "ventes" => VenteResource::collection($ventes)
        ]);
    }

    /**
     * Formulaire de création
     */
    function create()
    {
        $partenaires = Partenaire::all();

        return inertia("Ventes/Create", [
            "partenaires" => $partenaires,
        ]);
    }

    /**
     * Enregistrement d'un fond
     */
    function store(Request $request)
    {
        $validated = $request->validate([
            "partenaire_id" => ["required", "integer"],
            "prix" => ["required", "numeric"],
            "montant" => ["required", "numeric"],
            "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],

            "poids" => ["required", "numeric"],
            "nbre_sac_rejete" => ["required", "numeric"],
            "prix_unitaire_sac_rejete" => ["required", "numeric"],
            "montant_total" => ["required", "numeric"],

            "commentaire" => ["nullable"],
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

            "montant_total.required" => "Le montant total est requis.",
            "montant_total.numeric" => "Le montant total doit être un nombre.",
        ]);

        try {
            DB::beginTransaction();
            $vente = Vente::create($validated);

            DB::commit();
            Log::info("Nouvelle vente créé avec succès", ["vente_id" => $vente->id, "created_by" => auth()->user()->id]);
            return redirect()->route("depense.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création d'une vente", ["error" => $e->getMessage()]);
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
        return inertia("Ventes/Update", [
            'vente' => $vente,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Vente $vente)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                "partenaire_id" => ["required", "integer"],
                "prix" => ["required", "numeric"],
                "montant" => ["required", "numeric"],
                "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],

                "poids" => ["required", "numeric"],
                "nbre_sac_rejete" => ["required", "numeric"],
                "prix_unitaire_sac_rejete" => ["required", "numeric"],
                "montant_total" => ["required", "numeric"],

                "commentaire" => ["nullable"],
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

                "montant_total.required" => "Le montant total est requis.",
                "montant_total.numeric" => "Le montant total doit être un nombre.",
            ]);

            DB::beginTransaction();

            $vente->update($validated);

            DB::commit();
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
    function destroy(Vente $depense)
    {
        try {
            DB::beginTransaction();

            if (!$depense) {
                throw new \Exception("Cette vente n'existe pas");
            }
            $depense->delete();

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
