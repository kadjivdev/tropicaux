<?php

namespace App\Http\Controllers;

use App\Http\Resources\SchoolResource;
use App\Models\Role;
use App\Models\School;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SchoolController extends Controller
{
    /**
     * Index
     */
    function index(Request $request)
    {
        $schools = School::latest()->get();
        return Inertia::render('School/List', [
            'schools' => SchoolResource::collection($schools),
        ]);
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        return Inertia::render('School/Create');
    }

    /**
     * Store
     */
    function store(Request $request)
    {
        try {
            $validated = $request->validate([
                "raison_sociale" => "required",
                "adresse" => "nullable",

                "email" => "required",
                "phone" => "required",

                "logo" => "required",
                "ifu" => "nullable",
                "rccm" => "nullable",

                "slogan" => "required",
                "description" => "required"
            ], [
                "raison_sociale.required" => "Le nom rest réquis",

                "email.required" => "Le mail est réquis!",
                "phone.required" => "Le numéro de telephone est réquis!",

                "logo.required" => "Le logo est réquis!",

                "slogan.required" => "Le slogan est réquis",
                "description.required" => "La description est réquis"
            ]);

            DB::beginTransaction();

            $school = School::create($validated);

            /**
             * Generation des rôles
             */
            $defaultRoles = Role::whereNull("school_id")
                ->where('id', '!=', 1)
                ->pluck("name");

            $defaultRoles->each(function ($name) use ($school) {
                $school->roles()->create(["name" => $name . ' (' . $school->raison_sociale . ')']);
            });

            DB::commit();
            return redirect()->route("school.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création de l'école", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
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
        $schools = School::all();

        return Inertia::render('School/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request)
    {
        $schools = School::all();

        return Inertia::render('School/Create', [
            'schools' => $schools,
        ]);
    }

    /**
     * Destroy
     */
    function destroy(Request $request)
    {
        $schools = School::all();

        return Inertia::render('School/Create', [
            'schools' => $schools,
        ]);
    }
}
