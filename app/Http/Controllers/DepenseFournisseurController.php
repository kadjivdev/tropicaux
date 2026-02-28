<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepenseFournisseurResource;
use App\Http\Resources\DepenseVenteResource;
use App\Models\DepenseFournisseur;
use App\Models\DepenseVente;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class DepenseFournisseurController extends Controller
{
    /**
     * Liste des depenses superviseurs
     */

    function index()
    {
        $sessionId = Session::get("campagne")?->id;
        $depenses = DepenseFournisseur::where("campagne_id", $sessionId)->get();

        return inertia("DepenseFournisseurs/List", [
            "depenses" => DepenseFournisseurResource::collection($depenses)
        ]);
    }

    /**
     * Formulaire de création
     */
    function create()
    {
        $fournisseurs = Fournisseur::get();

        return inertia("DepenseFournisseurs/Create", [
            "fournisseurs" => $fournisseurs,
        ]);
    }

    /**
     * Enregistrement d'une dépense
     */
    function store(Request $request)
    {
        Log::info("Les données entrantes ", ["data" => $request->all()]);

        $validated = $request->validate(DepenseFournisseur::rules(), DepenseFournisseur::messages());

        try {
            DB::beginTransaction();
            $depense = DepenseFournisseur::create($validated);

            DB::commit();
            Log::info("Nouvelle dépense créée avec succès", ["depense_id" => $depense->id, "created_by" => auth()->user()->id]);
            return redirect()->route("depense-fournisseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création d'une depense", ["error" => $e->errors()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement de la depense : " . $e->errors()]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création d'une depense", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement de la depense : " . $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(DepenseFournisseur $depense_fournisseur)
    {
        $fournisseurs = Fournisseur::get();
        return inertia("DepenseFournisseurs/Update", [
            'depense' => $depense_fournisseur,
            "fournisseurs" => $fournisseurs,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, DepenseFournisseur $depense_fournisseur)
    {
        Log::info("Les data update depense", ["data" => $request->all()]);

        try {
            $validated = $request->validate(DepenseFournisseur::rules(), DepenseFournisseur::messages());

            DB::beginTransaction();

            $depense_fournisseur->update($validated);

            DB::commit();
            return redirect()->route("depense-fournisseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de la depense", ["error" => $e->errors()]);
            return back()->withErrors(["error" => "Erreure lors de la modification de la depense : " . $e->errors()]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de la depense", ["error" => $e->getMessage()]);
            return back()->withErrors(["error" => "Erreure lors de la modification de la depense : " . $e->getMessage()]);
        }
    }

    /**
     * Validation
     */
    function validatedDepense(DepenseFournisseur $depense)
    {
        Log::debug("La depense à valider :", ["data" => $depense]);

        try {
            DB::beginTransaction();

            $depense->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("depense-fournisseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la depense", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la depense", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(DepenseFournisseur $depense_fournisseur)
    {
        try {
            DB::beginTransaction();

            $depense_fournisseur->delete();

            DB::commit();
            return redirect()->route("depense-fournisseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la depense", ["error" => $e->errors()]);
            return back()->withErrors(["error" => $e->errors()]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression de la depense", ["error" => $e->getMessage()]);
            return back()->withErrors(["error" => $e->getMessage()]);
        }
    }
}
