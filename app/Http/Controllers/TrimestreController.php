<?php

namespace App\Http\Controllers;

use App\Http\Resources\TrimestreResource;
use App\Models\School;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TrimestreController extends Controller
{
    /**
     * Get all classes
     */
    function index()
    {
        if (Auth::user()->school) {
            $trimestres = Trimestre::orderByDesc("id")
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $trimestres = Trimestre::orderByDesc("id")->get();
        }

        return Inertia::render("Trimestre/List", [
            "trimestres" => TrimestreResource::collection($trimestres),
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

        return Inertia::render('Trimestre/Create', [
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
            ], [
                "school_id.required" => "L'école est réquise",
                "school_id.integer" => "L'école est invalide",
                "libelle.required" => "Le libelle est réquis!",
            ]);

            Trimestre::create($validated);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("trimestre.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la création du trimestre ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création du trimestre ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Edit
     */
    function edit(Request $request)
    {
        $schools = Trimestre::all();

        return Inertia::render('Trimestre/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = Trimestre::all();

        return Inertia::render('Trimestre/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = Trimestre::all();

        return Inertia::render('Trimestre/Create', [
            'schools' => $schools,
        ]);
    }
}
