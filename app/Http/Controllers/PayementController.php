<?php

namespace App\Http\Controllers;

use App\Http\Resources\PayementResource;
use App\Models\Apprenant;
use App\Models\Payement;
use App\Models\School;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PayementController extends Controller
{
    /**
     * Index
     */
    function index(Request $request)
    {
        if (Auth::user()->school) {
            $payements = Payement::latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $payements = Payement::latest()->get();
        }

        return Inertia::render('Payement/List', [
            'payements' => PayementResource::collection($payements),
        ]);
    }

    /**
     * Generate receit
     */

    function generateReceit(Payement $paiement)
    {
        try {
            $paiement->load(["school", "apprenant.parent.detail", "apprenant.classe"]);

            // return response()->json($paiement);

            /**
             * Reste à payer
             */
            $reste = ($paiement->apprenant?->classe?->scolarite ?? 0) - $paiement->montant;

            set_time_limit(0);
            $pdf = Pdf::loadView("pdfs.paiements.receit", [
                "paiement" => $paiement,
                "reste" => $reste
            ]);

            // Set PDF orientation to landscape
            $pdf->setPaper('a4', 'landscape');

            return $pdf->stream();
        } catch (\Exception $e) {
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        return Inertia::render('Payement/Create', [
            "apprenants" => Auth::user()->school_id ?
                Apprenant::where("school_id", Auth::user()->school_id)->get() :
                Apprenant::all(),
            "schools" => Auth::user()->school_id ?
                School::where("id", Auth::user()->school_id)->get() :
                School::all(),
        ]);
    }

    /**
     * Store
     */
    function store(Request $request)
    {
        Log::info("Les datas", ["data" => $request->all()]);
        try {
            $validated = $request->validate([
                "school_id"      => "required|integer",
                "apprenant_id"      => "required|integer",
                "montant"      => "required|numeric",
                "paiement_receit"          => "nullable|file",
            ], [
                "apprenant_id.required"      => "L'apprenant est obligatoire.",
                "apprenant_id.integer"       => "L'apprenant doit être un identifiant valide.",

                "school_id.required"      => "L'école est obligatoire.",
                "school_id.integer"       => "L'école doit être un identifiant valide.",

                "montant.required" => "Le montant est obligatoires.",
                "montant.numeric"  => "Le montant doit être un nombre valide.",

                "paiement_receit.file"             => "Le fichier est invalide",
                "paiement_receit.max"               => "La photo ne doit pas dépasser 2 Mo.",
            ]);

            DB::beginTransaction();

            Payement::create($validated);

            DB::commit();
            return redirect()->route("paiement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du paiement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du paiment", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Request $request)
    {
        $schools = Apprenant::all();

        return Inertia::render('Payement/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = Apprenant::all();

        return Inertia::render('Payement/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = Apprenant::all();

        return Inertia::render('Payement/Create', [
            'schools' => $schools,
        ]);
    }
}
