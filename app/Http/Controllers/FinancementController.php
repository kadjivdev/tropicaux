<?php

namespace App\Http\Controllers;

use App\Http\Resources\FinancementResource;
use App\Http\Resources\PreFinancementResource;
use App\Models\Financement;
use App\Models\Fournisseur;
use App\Models\PreFinancement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class FinancementController extends Controller
{
    /**
     * Liste des financements
     */

    function index()
    {
        $sessionId = Session::get("campagne")?->id;

        $prefinancements = PreFinancement::all();
        $financements = Financement::where("campagne_id", $sessionId)->get();
        $fournisseurs = Fournisseur::get(["id", "raison_sociale"]);

        return inertia("Financements/List", [
            "financements" => FinancementResource::collection($financements),
            "prefinancements" => PreFinancementResource::collection($prefinancements),
            "fournisseurs" => $fournisseurs,
        ]);
    }

    /**
     * Formulaire de création
     */

    function create()
    {
        $fournisseurs = Fournisseur::all();

        $sessionId = Session::get("campagne")?->id;
        $prefinancements = PreFinancement::whereNotNull("validated_by")
            ->get()
            ->filter(function ($query) {
                return $query->reste() > 0;
            });

        return inertia("Financements/Create", [
            "fournisseurs" => $fournisseurs,
            "prefinancements" => PreFinancementResource::collection($prefinancements),
        ]);
    }

    /**
     * Enregistrement d'un financement
     */
    function store(Request $request)
    {
        $validated = $request->validate([
            "fournisseur_id" => ["required", "integer"],
            "prefinancement_id" => ["required", "integer", "exists:pre_financements,id"],
            "montant" => ["required", "numeric"],
            "date_financement" => ["required", "date"],
            "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
        ], [
            "fournisseur_id.required" => "Le fournisseur est requis.",
            "fournisseur_id.integer" => "Le fournisseur doit être un entier.",

            "prefinancement_id.required" => "Le pré financement est requis.",
            "prefinancement_id.integer" => "Le pré financement doit être un entier.",

            "montant.required" => "Le montant est requis.",
            "montant.numeric" => "Le montant doit être un nombre.",

            "date_financement.required" => "La date de financement est requise.",
            "date_financement.date" => "La date de financement doit être une date valide.",

            "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",
        ]);

        try {
            DB::beginTransaction();
            $financement = Financement::create($validated);

            DB::commit();
            Log::info("Nouveau financement créé avec succès", ["financement_id" => $financement->id, "created_by" => auth()->user()->id]);
            return redirect()->route("financement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création du financement", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du financement"]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création du financement", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["exception" => "Une erreur est survenue lors de l'enregistrement du financement : " . $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Financement $financement)
    {
        $fournisseurs = Fournisseur::all();

        $sessionId = Session::get("campagne")?->id;

        $prefinancements = PreFinancement::whereNotNull("validated_by")
            ->get()
            ->filter(function ($query) {
                return $query->montant - $query->financements->sum("montant") > 0;
            });

        return inertia("Financements/Update", [
            'financement' => $financement,
            "fournisseurs" => $fournisseurs,
            "prefinancements" => PreFinancementResource::collection($prefinancements)
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Financement $financement)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                "fournisseur_id" => ["required", "integer"],
                "prefinancement_id" => ["required", "integer", "exists:pre_financements,id"],
                "montant" => ["required", "numeric"],
                "date_financement" => ["required", "date"],
                "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
            ], [
                "fournisseur_id.required" => "Le fournisseur est requis.",
                "fournisseur_id.integer" => "Le fournisseur doit être un entier.",

                "prefinancement_id.required" => "Le pré financement est requis.",
                "prefinancement_id.integer" => "Le pré financement doit être un entier.",

                "montant.required" => "Le montant est requis.",
                "montant.numeric" => "Le montant doit être un nombre.",

                "date_financement.required" => "La date de financement est requise.",
                "date_financement.date" => "La date de financement doit être une date valide.",

                "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",
            ]);

            DB::beginTransaction();

            $financement->update($validated);

            DB::commit();
            return redirect()->route("financement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du financement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du financement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Validation
     */
    function validatedFinancement(Financement $financement)
    {
        try {
            Log::debug("Validation du financement", ["financement" => $financement]);
            DB::beginTransaction();

            if (!$financement) {
                throw new \Exception("Ce financement n'existe pas");
            }

            $financement->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("financement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du financement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du financement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Transfert du reste d'un financement
     */
    function transfertReste(Request $request, Financement $financement)
    {
        try {
            DB::beginTransaction();

            Log::info("Financement :", ["data" => $financement]);

            if (!$financement) {
                throw new \Exception("Ce financement n'existe pas");
            }

            $validated = $request->validate([
                "reste" => "required|numeric",
                "fournisseur_id" => ["required", "integer"],
            ]);

            if ($financement->fournisseur_id == $validated["fournisseur_id"]) {
                throw new \Exception("Le transfert ne peut plus se faire sur le compte de " . Fournisseur::firstWhere("id", $validated["fournisseur_id"])?->raison_sociale);
            }

            $validated["montant"] = $validated["reste"];
            $validated["date_financement"] = now();
            $validated["validated_at"] = now();
            $validated["validated_by"] = Auth::id();
            $validated["prefinancement_id"] = $financement->prefinancement_id;

            //Generation d'un financement au nouveau gestionnaire
            $financement->financements()->create($validated);
           
            //Mise à jour du financement initial pour indiquer le montant transféré et le pré-financement lié
            $financement->update([
                "reste_transfere" => $financement->reste_transfere + $validated["reste"],
            ]);

            Log::info("Donnée validées", ["data" => $validated]);
            Log::debug("Transfert du reste effecté pour le financement", ["financement" => $financement]);
            DB::commit();
            return redirect()->route("financement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors du transfert du financement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors du transfert du financement", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(Financement $financement)
    {
        try {
            DB::beginTransaction();

            if (!$financement) {
                throw new \Exception("Ce financement n'existe pas");
            }
            $financement->delete();

            DB::commit();
            return redirect()->route("financement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du financements", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du financements", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
