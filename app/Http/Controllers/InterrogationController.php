<?php

namespace App\Http\Controllers;

use App\Http\Resources\ApprenantResource;
use App\Http\Resources\InterrogationResource;
use App\Http\Resources\MatiereResource;
use App\Http\Resources\SchoolResource;
use App\Http\Resources\TrimestreResource;
use App\Models\Apprenant;
use App\Models\Interrogation;
use App\Models\Matiere;
use App\Models\School;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class InterrogationController extends Controller
{
    /**
     * Get all devoirs
     */
    function index()
    {
        if (Auth::user()->school) {
            $interrogations = Interrogation::orderByDesc("id")
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $interrogations = Interrogation::orderByDesc("id")->get();
        }

        return Inertia::render("Interrogation/List", [
            "interrogations" => InterrogationResource::collection($interrogations),
        ]);
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        if (Auth::user()->school) {
            $schools = School::latest()
                ->where("id", Auth::user()->school_id)->get();

            $apprenants = Apprenant::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $trimestres = Trimestre::latest()
                ->where("school_id", Auth::user()->school_id)->get();

            $matieres = Matiere::latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $schools = School::latest()->get();
            // dd($schools);
            $apprenants = Apprenant::latest()->get();

            $trimestres = Trimestre::latest()->get();

            $matieres = Matiere::latest()->get();
        }

        return Inertia::render('Interrogation/Create', [
            "schools" => SchoolResource::collection($schools),
            "apprenants" => ApprenantResource::collection($apprenants),
            "trimestres" => TrimestreResource::collection($trimestres),
            "matieres" => MatiereResource::collection($matieres),
        ]);
    }

    /**
     * Store des datas
     */
    function store(Request $request)
    {
        try {
            DB::beginTransaction();

            Log::debug("Donnees entrees", ["data" => $request->all()]);

            $validated = $request->validate([
                "school_id"     => "required|integer",
                "apprenant_id"  => "required|integer",
                "trimestre_id"  => "required|integer",
                "matiere_id"    => "required|integer",
                "note"          => "required|numeric",
            ], [
                "school_id.required"    => "L'identifiant de l'école est obligatoire.",
                "school_id.integer"     => "L'identifiant de l'école doit être un nombre entier.",

                "apprenant_id.required" => "L'identifiant de l'apprenant est obligatoire.",
                "apprenant_id.integer"  => "L'identifiant de l'apprenant doit être un nombre entier.",

                "trimestre_id.required" => "L'identifiant du trimestre est obligatoire.",
                "trimestre_id.integer"  => "L'identifiant du trimestre doit être un nombre entier.",

                "matiere_id.required"   => "L'identifiant de la matière est obligatoire.",
                "matiere_id.integer"    => "L'identifiant de la matière doit être un nombre entier.",

                "note.required"         => "La note est obligatoire.",
                "note.numeric"          => "La note doit être un nombre.",
            ]);

            Interrogation::create($validated);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("interrogation.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la création de l'interrogation ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création de l'interrogation ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Edit
     */
    function edit(Request $request)
    {
        $schools = Interrogation::all();

        return Inertia::render('Interrogation/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = Interrogation::all();

        return Inertia::render('Interrogation/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = Interrogation::all();

        return Inertia::render('Interrogation/Create', [
            'schools' => $schools,
        ]);
    }
}
