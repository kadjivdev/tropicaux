<?php

namespace App\Http\Controllers;

use App\Http\Resources\CampganeResource;
use App\Models\Campagne;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Request;

class CampagneController extends Controller
{
    /**
     * Get all campagnes
     */
    function index()
    {
        // Annulation de la sesssion en cours

        $campagnes = Campagne::all();
        return Inertia::render("Campagnes/List", [
            "campagnes" => CampganeResource::collection($campagnes)
        ]);
    }

    /**
     * Create campagnes
     */
    function create(Request $request)
    {
        return Inertia::render("Campagnes/Create");
    }

    /**
     * Store campagnes
     */
    function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate(
                [
                    "libelle" => "required|unique:campagnes,libelle",
                    "description" => "nullable"
                ],
                [
                    "libelle.required" => "Le nom de la campagne est réquise!"
                ]
            );

            Campagne::create($validated);

            DB::commit();
            return redirect()->route("campagne.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de l'insertion des données", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de l'insertion des données", ["exception" => $e->getMessage()]);
            return back()->with(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit campagnes
     */
    function edit(Request $request, Campagne $campagne)
    {
        return Inertia::render("Campagnes/Update", [
            "campagne" => $campagne
        ]);
    }

    /**
     * Update campagnes
     */
    function update(Request $request, Campagne $campagne)
    {
        try {
            DB::beginTransaction();

            if (!$campagne) {
                throw new \Exception("Cette campagne n'existe pas!");
            }

            $validated = $request->validate(
                [
                    "libelle" => "required|unique:campagnes,libelle," . $campagne->id,
                    "description" => "nullable"
                ],
                [
                    "libelle.required" => "Le nom de la campagne est réquise!"
                ]
            );

            $campagne->update($validated);

            DB::commit();
            return redirect()->route("campagne.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de l'insertion des données", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure de validation lors de l'insertion des données", ["exception" => $e->getMessage()]);
            return back()->with(["exception" => $e->getMessage()]);
        }
    }
}
