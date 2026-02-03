<?php

namespace App\Http\Controllers;

// use App\Http\Resources\FinancementResource;
use App\Http\Resources\PreFinancementResource;
use App\Models\GestionnaireFond;
// use App\Models\Financement;
// use App\Models\Fournisseur;
use App\Models\PreFinancement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class PreFinancementController extends Controller
{
    /**
     * Liste des pre_financements
     */

    function index()
    {
        $sessionId = Session::get("campagne")?->id;
        $preFinancements = PreFinancement::where("campagne_id", $sessionId)->get();

        // $gestionnaires = User::whereHas("roles", function ($role) {
        //     $role->where("name", "Gestionnaire de fonds");
        // })->get();

        $gestionnaires = GestionnaireFond::all(["id","raison_sociale"]);

        return inertia("PreFinancements/List", [
            "financements" => PreFinancementResource::collection($preFinancements),
            "gestionnaires" => $gestionnaires
        ]);
    }

    /**
     * Formulaire de création
     */

    function create()
    {
        // $gestionnaires = User::whereHas("roles", function ($role) {
        //     $role->where("name", "Gestionnaire de fonds");
        // })->get();

        $gestionnaires = GestionnaireFond::all(["id","raison_sociale"]);

        return inertia("PreFinancements/Create", [
            "gestionnaires" => $gestionnaires
        ]);
    }

    /**
     * Enregistrement d'un pré-financement
     */
    function store(Request $request)
    {
        $validated = $request->validate([
            "gestionnaire_id" => ["required", "integer"],
            "montant" => ["required", "numeric"],
            "date_financement" => ["required", "date"],
            "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
        ], [
            "gestionnaire_id.required" => "Le gestionnaire est requis.",
            "gestionnaire_id.integer" => "Le gestionnaire doit être un entier.",

            "montant.required" => "Le montant est requis.",
            "montant.numeric" => "Le montant doit être un nombre.",

            "date_financement.required" => "La date de financement est requise.",
            "date_financement.date" => "La date de financement doit être une date valide.",

            "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",
        ]);

        try {
            DB::beginTransaction();
            $prefinancement = PreFinancement::create($validated);

            DB::commit();
            Log::info("Nouveau pré financement créé avec succès", ["prefinancement_id" => $prefinancement->id, "created_by" => auth()->user()->id]);
            return redirect()->route("prefinancement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création du préfinancement", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du préfinancement"]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création du préfinancement", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["exception" => "Une erreur est survenue lors de l'enregistrement du préfinancement : " . $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(PreFinancement $prefinancement)
    {
        // $gestionnaires = User::whereHas("roles", function ($role) {
        //     $role->where("name", "Gestionnaire de fonds");
        // })->get();

        $gestionnaires = GestionnaireFond::all(["id","raison_sociale"]);

        return inertia("PreFinancements/Update", [
            "financement" => $prefinancement,
            "gestionnaires" => $gestionnaires
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, PreFinancement $prefinancement)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                "gestionnaire_id" => ["required", "integer"],
                "montant" => ["required", "numeric"],
                "date_financement" => ["required", "date"],
                "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
            ], [
                "gestionnaire_id.required" => "Le gestionnaire est requis.",
                "gestionnaire_id.integer" => "Le gestionnaire doit être un entier.",

                "montant.required" => "Le montant est requis.",
                "montant.numeric" => "Le montant doit être un nombre.",

                "date_financement.required" => "La date de financement est requise.",
                "date_financement.date" => "La date de financement doit être une date valide.",

                "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",
            ]);

            DB::beginTransaction();

            $prefinancement->update($validated);

            DB::commit();
            return redirect()->route("prefinancement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du pré-financement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du pré-financement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Validation
     */
    function validatedPreFinancement(PreFinancement $prefinancement)
    {

        try {
            DB::beginTransaction();

            if (!$prefinancement) {
                throw new \Exception("Ce pré-financement n'existe pas");
            }

            $prefinancement->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("prefinancement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du pré-financement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du pré-financement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Transfert du reste d'un pré-financement
     */
    function transfertReste(Request $request, PreFinancement $prefinancement)
    {
        try {
            DB::beginTransaction();

            Log::info("All datas", ["data" => $request->all()]);

            if (!$prefinancement) {
                throw new \Exception("Ce pré-financement n'existe pas");
            }

            $validated = $request->validate([
                "reste" => "required|numeric",
                "gestionnaire_id" => ["required", "integer"],
            ]);

            if ($prefinancement->gestionnaire_id == $validated["gestionnaire_id"]) {
                throw new \Exception("Le transfert ne peut plus se faire sur le compte de " . User::firstWhere("id", $validated["gestionnaire_id"])?->firstname);
            }

            $validated["montant"] = $validated["reste"];
            $validated["date_financement"] = now();
            $validated["validated_at"] = now();
            $validated["validated_by"] = Auth::id();

            //Generation d'un pré-financement au nouveau gestionnaire
            $newPrefinancement = PreFinancement::create($validated);

            $prefinancement->update([
                "reste_transfere" => $validated["reste"],
                "prefinancement_id" => $newPrefinancement->id
            ]);

            Log::info("Donnée validées", ["data" => $validated]);

            Log::debug("Transfert du reste effecté pour le pré-financement", ["prefinancement" => $prefinancement]);
            DB::commit();
            return redirect()->route("prefinancement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors du transfert du pré-financement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors du transfert du pré-financement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(PreFinancement $prefinancement)
    {
        try {
            DB::beginTransaction();

            if (!$prefinancement) {
                throw new \Exception("Ce pré-financement n'existe pas");
            }
            $prefinancement->delete();

            DB::commit();
            return redirect()->route("prefinancement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du prefinancements", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du prefinancements", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
