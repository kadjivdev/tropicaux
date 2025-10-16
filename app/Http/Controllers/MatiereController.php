<?php

namespace App\Http\Controllers;

use App\Http\Resources\MatiereResource;
use App\Models\Matiere;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MatiereController extends Controller
{
    /**
     * Get all matières
     */
    function index()
    {
        if (Auth::user()->school) {
            $matieres = Matiere::orderByDesc("id")
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $matieres = Matiere::orderByDesc("id")->get();
        }

        return Inertia::render("Matiere/List", [
            "matieres" => MatiereResource::collection($matieres),
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
        } else {
            $schools = School::latest()->get();
        }

        return Inertia::render('Matiere/Create', [
            "schools" => $schools,
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
                "school_id" => "required|integer",
                "libelle" => "required",
                "coefficient" => "required|numeric",
            ], [
                "school_id.required" => "L'école est réquise",
                "school_id.integer" => "L'école est invalide",
                "libelle.required" => "Le libelle est réquis!",

                "coefficient.required" => "Le coefficient est réquis!",
                "coefficient.numeric" => "Le coefficient est invalide!",
            ]);

            Matiere::create($validated);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("matiere.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la création de la matière ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création de la matière ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Edit
     */
    function edit(Request $request)
    {
        $schools = Matiere::all();

        return Inertia::render('Matiere/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = Matiere::all();

        return Inertia::render('Matiere/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = Matiere::all();

        return Inertia::render('Matiere/Create', [
            'schools' => $schools,
        ]);
    }
}
