<?php

namespace App\Http\Controllers;

use App\Http\Resources\InscriptionResource;
use App\Models\Apprenant;
use App\Models\Classe;
use App\Models\Inscription;
use App\Models\School;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InscriptionController extends Controller
{
    /**
     * Index
     */
    function index(Request $request)
    {
        if (Auth::user()->school) {
            $inscriptions = Inscription::latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $inscriptions = Inscription::latest()->get();
        }

        return Inertia::render('Inscription/List', [
            'inscriptions' => InscriptionResource::collection($inscriptions),
        ]);
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        return Inertia::render('Inscription/Create', [
            "apprenants" => Auth::user()->school_id ?
                Apprenant::where("id", Auth::user()->school_id)->get() :
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
                "school_id"          => "required|integer",
                "apprenant_id"       => "required|integer",
                "numero_educ_master" => "required|string",
                "frais_inscription"  => "required|numeric",
                "dossier_transfert"  => "nullable|file|mimes:pdf,doc,docx|max:2048",
            ], [
                "school_id.required"      => "L'école est obligatoire.",
                "school_id.integer"       => "L'école doit être un identifiant valide.",

                "apprenant_id.required"   => "L'apprenant est obligatoire.",
                "apprenant_id.integer"    => "L'apprenant doit être un identifiant valide.",

                "numero_educ_master.required" => "Le numéro éduc master est obligatoire.",

                "frais_inscription.required" => "Les frais d’inscription sont obligatoires.",
                "frais_inscription.numeric"  => "Les frais doivent être un nombre valide.",

                "dossier_transfert.file"     => "Le dossier de transfert doit être un fichier.",
                "dossier_transfert.mimes"    => "Le dossier doit être un fichier PDF ou Word (pdf, doc, docx).",
                "dossier_transfert.max"      => "Le dossier de transfert ne doit pas dépasser 2 Mo.",
            ]);

            DB::beginTransaction();

            Inscription::create($validated);

            DB::commit();
            return redirect()->route("inscription.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création de l'école", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création de l'école", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }


    /**
     * Edit
     */
    function edit(Request $request)
    {
        $schools = Inscription::all();

        return Inertia::render('Apprenant/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = Inscription::all();

        return Inertia::render('Apprenant/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Generate receit
     */

    function generateReceit(Inscription $inscription, $reste)
    {
        $inscription->load(["school", "apprenant.parent.detail", "apprenant.classe"]);

        set_time_limit(0);
        $pdf = Pdf::loadView("pdfs.souscriptions.receit", [
            "inscription" => $inscription,
            "reste" => $reste
        ]);

        // Set PDF orientation to landscape
        $pdf->setPaper('a4', 'landscape');

        return $pdf->stream();
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = Inscription::all();

        return Inertia::render('Apprenant/Create', [
            'schools' => $schools,
        ]);
    }
}
