<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepenseGeneraleResource;
use App\Http\Resources\DepenseVenteResource;
use App\Models\DepenseGeneraleType;
use App\Models\DepenseVente;
use App\Models\GeneralDepense;
use App\Models\Vente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class GeneralDepenseController extends Controller
{
    /**
     * Liste des depenses generales
     */

    function index()
    {
        $sessionId = Session::get("campagne")?->id;
        $depenses = GeneralDepense::where("campagne_id", $sessionId)->get();

        return inertia("DepenseGenerales/List", [
            "depenses" => DepenseGeneraleResource::collection($depenses)
        ]);
    }

    /**
     * Formulaire de création
     */
    function create()
    {
        $types = DepenseGeneraleType::get();

        return inertia("DepenseGenerales/Create", [
            "types" => $types,
        ]);
    }

    /**
     * Enregistrement d'une dépense
     */
    function store(Request $request)
    {
        Log::info("Les données entrantes ", ["data" => $request->all()]);

        $validated = $request->validate(GeneralDepense::rules(), GeneralDepense::messages());

        try {
            DB::beginTransaction();
            $depense = GeneralDepense::create($validated);

            DB::commit();
            Log::info("Nouvelle dépense créée avec succès", ["depense_id" => $depense->id, "created_by" => auth()->user()->id]);
            return redirect()->route("depense-generale.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création d'une depense", ["error" => $e->errors()]);
            DB::rollBack();
            return back()->withErrors(["error" => $e->errors()]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création d'une depense", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement de la depense : " . $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(GeneralDepense $depense_generale)
    {
        $types = DepenseGeneraleType::get();
        return inertia("DepenseGenerales/Update", [
            'depense' => $depense_generale,
            "types" => $types,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, GeneralDepense $depense_generale)
    {
        Log::info("Les datas update depense", ["data" => $request->all()]);

        try {
            $validated = $request->validate(GeneralDepense::rules(), GeneralDepense::messages());

            DB::beginTransaction();

            $depense_generale->update($validated);

            DB::commit();
            return redirect()->route("depense-generale.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de la depense", ["error" => $e->errors()]);
            return back()->withErrors(["error" => $e->errors()]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de la depense", ["error" => $e->getMessage()]);
            return back()->withErrors(["error" => "Erreure lors de la modification de la depense : " . $e->getMessage()]);
        }
    }

    /**
     * Validation
     */
    function validatedDepense(GeneralDepense $depense)
    {
        Log::debug("La depense à valider :", ["data" => $depense]);

        try {
            DB::beginTransaction();

            $depense->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("depense-generale.index");
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
    function destroy(GeneralDepense $depense_generale)
    {
        try {
            DB::beginTransaction();

            $depense_generale->delete();

            DB::commit();
            return redirect()->route("depense-generale.index");
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
