<?php

namespace App\Http\Controllers;

use App\Http\Requests\SoldeRequestRequest;
use App\Http\Resources\SoldeRequestResource;
use App\Models\Fournisseur;
use App\Models\SoldeRequest;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SoldeRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sessionId = Session::get("campagne")?->id;
        $requetes = SoldeRequest::where("campagne_id", $sessionId)->get();

        return Inertia::render("Fournisseurs/Requetes/List", [
            "requetes" => SoldeRequestResource::collection($requetes)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Fournisseurs/Requetes/Create", [
            "fournisseurs" => Fournisseur::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SoldeRequestRequest $request)
    {
        try {
            Log::info("Debut de la création des requetes", ["data" => $request->all()]);
            DB::beginTransaction();

            $requete = SoldeRequest::create($request->validated());

            DB::commit();
            Log::debug("Requete insereé avec succès!", ["data" => $requete]);
            return redirect()->route("requete_fournisseur.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de l'insertion de la requete", ["errors" => $e->errors()]);
            return redirect()->back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure d'exception lors de l'insertion de la requete", ["exception" => $e->getMessage()]);
            return redirect()->back()->with(["error" => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $requete_fournisseur)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SoldeRequest $requete_fournisseur)
    {
        return Inertia::render("Fournisseurs/Requetes/Update", [
            "fournisseurs" => Fournisseur::all(),
            "requete" => $requete_fournisseur
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SoldeRequestRequest $request, SoldeRequest $requete_fournisseur)
    {
        try {
            Log::info("Debut de la modification des requetes", ["data" => $request->all()]);
            DB::beginTransaction();

            $requete_fournisseur->update($request->validated());

            DB::commit();
            Log::debug("Requete modifiée avec succès!", ["data" => $requete_fournisseur]);
            return redirect()->route("requete_fournisseur.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la modification de la requete", ["errors" => $e->errors()]);
            return redirect()->back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure d'exception lors de la modification de la requete", ["exception" => $e->getMessage()]);
            return redirect()->back()->with(["error" => $e->getMessage()]);
        }
    }

    /**
     * Validation
     */

    function validateSoldeRequeste(SoldeRequest $requete_fournisseur)
    {
        Log::debug("Début de validation de la requete éffetuée avec succès!", ["requete" => $requete_fournisseur]);
        try {
            DB::beginTransaction();
            $requete_fournisseur->update([
                "validated_by" => Auth::id(),
                "validated_at" => now()
            ]);
            DB::commit();

            $requete_fournisseur->refresh();

            Log::debug("Validation de la requete éffetuée avec succès!", ["data" => $requete_fournisseur]);
            return redirect()->route("requete_fournisseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors la validtion de la requete", ["errors" => $e->errors()]);
            return redirect()->back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors la validtion de la requete", ["errors" => $e->getMessage()]);
            return redirect()->back()->withErrors($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SoldeRequest $requete_fournisseur)
    {
        try {
            DB::beginTransaction();
            $requete_fournisseur->delete();
            Log::debug("Suppression de la requete éffetuée avec succès!", ["data" => $requete_fournisseur]);
            DB::commit();
            return redirect()->route("requete_fournisseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors la validtion de la requete", ["errors" => $e->errors()]);
            return redirect()->back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors la validtion de la requete", ["errors" => $e->getMessage()]);
            return redirect()->back()->withErrors($e->getMessage());
        }
    }
}
