<?php

namespace App\Http\Controllers;

use App\Http\Resources\FondResource;
use App\Models\Chargement;
use App\Models\FondSuperviseur;
use App\Models\Superviseur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class FondSuperviseurController extends Controller
{
    /**
     * Liste des fons aux superviseurs
     */

    function index()
    {
        $sessionId = Session::get("campagne")?->id;

        $fonds = FondSuperviseur::where("campagne_id", $sessionId)->get();
        return inertia("Fonds/List", [
            "fonds" => FondResource::collection($fonds)
        ]);
    }

    /**
     * Formulaire de création
     */
    function create()
    {
        $sessionId = Session::get("campagne")?->id;
        $chargements = Chargement::where("campagne_id", $sessionId)
            ->whereNotNull("validated_by")
            ->get();
        $superviseurs = Superviseur::all();

        return inertia("Fonds/Create", [
            "chargements" => $chargements,
            "superviseurs" => $superviseurs,
        ]);
    }

    /**
     * Enregistrement d'un fond
     */
    function store(Request $request)
    {
        Log::info("Les données entrantes ", ["datas" => $request->all()]);

        $validated = $request->validate([
            "chargement_id" => ["required", "integer"],
            "superviseur_id" => ["required", "integer"],
            "montant" => ["required", "numeric"],
            "commentaire" => ["nullable"],
            "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
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
            $fond = FondSuperviseur::create($validated);

            DB::commit();
            Log::info("Nouveau fond créé avec succès", ["fond_id" => $fond->id, "created_by" => auth()->user()->id]);
            return redirect()->route("fond-superviseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création du fond", ["error" => $e->errors()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du fond : " . $e->errors()]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création du fond", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du fond : " . $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit($id)
    {
        $fond = FondSuperviseur::find($id);
        $sessionId = Session::get("campagne")?->id;
        $chargements = Chargement::where("campagne_id", $sessionId)
            ->whereNotNull("validated_by")
            ->get();
        $superviseurs = Superviseur::all();

        return inertia("Fonds/Update", [
            'fond' => $fond,
            "chargements" => $chargements,
            "superviseurs" => $superviseurs,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, FondSuperviseur $fond_superviseur)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                "chargement_id" => ["required", "integer"],
                "superviseur_id" => ["required", "integer"],
                "montant" => ["required", "numeric"],
                // "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
                "commentaire" => ["nullable"],
            ], [
                "chargement_id.required" => "Le chargement est requis.",
                "chargement_id.integer" => "Le chargement doit être un entier.",

                "superviseur_id.required" => "Le superviseur est requis.",
                "superviseur_id.integer" => "Le superviseur doit être un entier.",

                "montant.required" => "Le montant est requis.",
                "montant.numeric" => "Le montant doit être un nombre.",

                // "document.file" => "Le document doit être un fichier.",
                // "document.mimes" => "Le document doit être au format PDF, PNG, JPG ou JPEG.",
            ]);

            DB::beginTransaction();

            $fond_superviseur->update($validated);

            DB::commit();
            return redirect()->route("fond-superviseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du fond", ["error" => $e->errors()]);
            return back()->withErrors(["error" => "Erreure lors de la modification du fond : " . $e->errors()]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du fond", ["error" => $e->getMessage()]);
            return back()->withErrors(["error" => "Erreure lors de la modification du fond : " . $e->getMessage()]);
        }
    }

    /**
     * Validation
     */
    function validatedFond(FondSuperviseur $fond)
    {
        try {
            DB::beginTransaction();

            if (!$fond) {
                throw new \Exception("Ce fond n'existe pas");
            }

            $fond->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);

            DB::commit();
            return redirect()->route("fond-superviseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du fonds", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du fonds", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy($fondId)
    {
        try {
            DB::beginTransaction();

            $fond = FondSuperviseur::find($fondId);
            if (!$fond) {
                throw new \Exception("Ce fond n'existe pas");
            }

            $fond->delete();

            DB::commit();
            return redirect()->route("fond-superviseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du fonds", ["error" => $e->errors()]);
            return back()->withErrors(["error" => $e->errors()]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du fonds", ["error" => $e->getMessage()]);
            return back()->withErrors(["error" => $e->getMessage()]);
        }
    }
}
