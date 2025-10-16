<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClasseResource;
use App\Http\Resources\SerieResource;
use App\Models\Classe;
use App\Models\School;
use App\Models\Serie;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SerieController extends Controller
{
    /**
     * Get all classes
     */
    function index()
    {
        if (Auth::user()->school) {
            $series = Serie::where("school_id", Auth::user()->school_id)->get();
        } else {
            $series = Serie::get();
        }

        return Inertia::render("Serie/List", [
            "series" => SerieResource::collection($series),
        ]);
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        if (Auth::user()->school) {
            $schools = School::where("id", Auth::user()->school_id)->get();
        } else {
            $schools = School::get();
        }

        return Inertia::render('Serie/Create', [
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

            Serie::create($validated);

            Log::debug("Donnees validées", ["data" => $validated]);
            DB::commit();

            return redirect()->route("serie.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la création de la série ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création de la série ", ["exception" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Request $request)
    {
        $schools = Serie::all();

        return Inertia::render('Payement/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = Serie::all();

        return Inertia::render('Payement/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = Serie::all();

        return Inertia::render('Payement/Create', [
            'schools' => $schools,
        ]);
    }
}
