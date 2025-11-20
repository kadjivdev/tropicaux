<?php

namespace App\Http\Controllers;

use App\Http\Resources\FinancementBackResource;
use App\Http\Resources\FinancementResource;
use App\Http\Resources\PreFinancementResource;
use App\Models\Financement;
use App\Models\FinancementBack;
use App\Models\Fournisseur;
use App\Models\PreFinancement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class FinancementBackController extends Controller
{
    /**
     * Liste des retours de financements
     */

    function index()
    {
        $sessionId = Session::get("campagne")?->id;

        $financementBacks = FinancementBack::where("campagne_id", $sessionId)->get();
        return inertia("FinancementBacks/List", [
            "financement_backs" => FinancementBackResource::collection($financementBacks)
        ]);
    }

    /**
     * Formulaire de création
     */

    function create()
    {
        $sessionId = Session::get("campagne")?->id;
        $financements = Financement::where("campagne_id", $sessionId)
            ->whereNotNull("validated_by")
            ->get();

        return inertia("FinancementBacks/Create", [
            "financements" => FinancementResource::collection($financements),
        ]);
    }

    /**
     * Enregistrement d'un retour de financement
     */
    function store(Request $request)
    {
        $validated = $request->validate([
            "financement_id" => ["required", "integer", "exists:financements,id"],
            "montant" => ["required", "numeric"],
            "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
        ], [
            "financement_id.required" => "Le financement est requis.",
            "financement_id.integer" => "Le financement doit être un entier.",

            "montant.required" => "Le montant est requis.",
            "montant.numeric" => "Le montant doit être un nombre.",

            "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",
        ]);

        try {
            DB::beginTransaction();
            $financementback = FinancementBack::create($validated);

            DB::commit();
            Log::info("Nouveau retour de financement créé avec succès", ["financement_back" => $financementback, "created_by" => auth()->user()->id]);
            return redirect()->route("backfinancement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création du retour des financements", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du retour du financement"]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création du retour des financements", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["exception" => "Une erreur est survenue lors de l'enregistrement du retour du financement : " . $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(FinancementBack $backfinancement)
    {
        $sessionId = Session::get("campagne")?->id;

        $backfinancement->load("financement");
        $backfinancement["financement_montant_r"] = $backfinancement->financement->montant - $backfinancement->financement->backFinancements
            ->whereNotNull("validated_by")
            ->sum("montant");

        $financements = Financement::where("campagne_id", $sessionId)
            ->whereNotNull("validated_by")
            ->get();

        return inertia("FinancementBacks/Update", [
            "backfinancement" => $backfinancement,
            "financements" => FinancementBackResource::collection($financements)
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, FinancementBack $backfinancement)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                "financement_id" => ["required", "integer", "exists:financements,id"],
                "montant" => ["required", "numeric"],
                "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
            ], [
                "financement_id.required" => "Le financement est requis.",
                "financement_id.integer" => "Le financement doit être un entier.",

                "montant.required" => "Le montant est requis.",
                "montant.numeric" => "Le montant doit être un nombre.",

                "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",
            ]);

            DB::beginTransaction();

            $backfinancement->update($validated);

            DB::commit();
            return redirect()->route("backfinancement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du retour de financement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du retour de financement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Validation
     */
    function validatedFinancementBack(FinancementBack $backfinancement)
    {
        try {
            DB::beginTransaction();

            if (!$backfinancement) {
                throw new \Exception("Ce retour de financement n'existe pas");
            }

            $backfinancement->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("backfinancement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du retour de financement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du retour de financement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(FinancementBack $backfinancement)
    {
        try {
            DB::beginTransaction();

            if (!$backfinancement) {
                throw new \Exception("Ce retour de financement n'existe pas");
            }
            $backfinancement->delete();

            DB::commit();
            return redirect()->route("backfinancement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du retour des financements", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du retour des financements", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
