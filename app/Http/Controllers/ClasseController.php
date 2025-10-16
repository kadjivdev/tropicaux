<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClasseResource;
use App\Models\Classe;
use App\Models\School;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ClasseController extends Controller
{
    /**
     * Get all classes
     */
    function index()
    {
        if (Auth::user()->school) {
            $classes = Classe::orderByDesc("id")
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $classes = Classe::orderByDesc("id")->get();
        }

        return Inertia::render("Classe/List", [
            "classes" => ClasseResource::collection($classes),
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

        return Inertia::render('Classe/Create', [
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

            Log::debug("Donnees entrees",["data"=>$request->all()]);

            $validated = $request->validate([
                "school_id" => "required|integer",
                "libelle" => "required",
                "scolarite" => "required|numeric",
            ], [
                "school_id.required" => "L'école est réquise",
                "school_id.integer" => "L'école est invalide",
                "libelle.required" => "Le libelle est réquis!",
                "scolarite.required" => "La scolarité est réquise",
                "scolarite.numeric" => "Le format n'est pas valide",
            ]);

            Classe::create($validated);

            Log::debug("Donnees validées",["data"=>$validated]);
            DB::commit();

            return redirect()->route("classe.index");
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de la création de la classe ", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la création de la classe ", ["exception" => $e->getMessage()]);
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Edit
     */
    function edit(Request $request)
    {
        $schools = Classe::all();

        return Inertia::render('Payement/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = Classe::all();

        return Inertia::render('Payement/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = Classe::all();

        return Inertia::render('Payement/Create', [
            'schools' => $schools,
        ]);
    }
}
