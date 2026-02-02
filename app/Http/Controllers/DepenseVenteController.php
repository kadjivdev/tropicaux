<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepenseVenteResource;
use App\Models\DepenseVente;
use App\Models\Vente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class DepenseVenteController extends Controller
{
    /**
     * Liste des depenses superviseurs
     */

    function index()
    {
        $sessionId = Session::get("campagne")?->id;
        $depenses = DepenseVente::where("campagne_id", $sessionId)->get();

        return inertia("DepenseVentes/List", [
            "depenses" => DepenseVenteResource::collection($depenses)
        ]);
    }

    /**
     * Formulaire de création
     */
    function create()
    {
        $sessionId = Session::get("campagne")?->id;
        $ventes = Vente::where("campagne_id", $sessionId)
            ->whereNotNull("validated_by")
            ->get();

        return inertia("DepenseVentes/Create", [
            "ventes" => $ventes,
        ]);
    }

    /**
     * Enregistrement d'une dépense
     */
    function store(Request $request)
    {
        Log::info("Les données entrantes ", ["data" => $request->all()]);

        $validated = $request->validate(DepenseVente::rules(), DepenseVente::messages());

        try {
            DB::beginTransaction();
            $depense = DepenseVente::create($validated);

            DB::commit();
            Log::info("Nouvelle dépense créée avec succès", ["depense_id" => $depense->id, "created_by" => auth()->user()->id]);
            return redirect()->route("depense-vente.index");
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
    function edit(DepenseVente $depense_vente)
    {
       
        $sessionId = Session::get("campagne")?->id;
        $ventes = Vente::where("campagne_id", $sessionId)
            ->whereNotNull("validated_by")
            ->get();

        return inertia("DepenseVentes/Update", [
            'depense' => $depense_vente,
            "ventes" => $ventes,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, DepenseVente $depense_vente)
    {
        Log::info("Les datas update depense", ["data" => $request->all()]);

        try {
            $validated = $request->validate(DepenseVente::rules(), DepenseVente::messages());

            DB::beginTransaction();

            $depense_vente->update($validated);

            DB::commit();
            return redirect()->route("depense-vente.index");
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
    function validatedDepense(DepenseVente $depense)
    {
        Log::debug("La depense à vaider :",["data"=>$depense]);

        try {
            DB::beginTransaction();

            $depense->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("depense-vente.index");
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
    function destroy(DepenseVente $depense_vente)
    {
        try {
            DB::beginTransaction();

            $depense_vente->delete();

            DB::commit();
            return redirect()->route("depense-vente.index");
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
