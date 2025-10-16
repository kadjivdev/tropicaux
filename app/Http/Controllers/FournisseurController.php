<?php

namespace App\Http\Controllers;

use App\Http\Resources\FournisseurResource;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FournisseurController extends Controller
{
    /**
     * Listes des fournisseurs
     */

    function index()
    {
        $fournisseurs = Fournisseur::all();
        return inertia("Fournisseurs/List", [
            "fournisseurs" => FournisseurResource::collection($fournisseurs)
        ]);
    }

    /**
     * Formulaire de création
     */
    function create()
    {
        return inertia("Fournisseurs/Create");
    }

    /**
     * Enregistrement d'un fournisseur
     */
    function store(Request $request)
    {
        $request->validate([
            "raison_sociale" => ["required", "string", "max:255"],
            "phone" => ["nullable", "string", "max:255"],
            "email" => ["nullable", "string", "max:255"],
            "adresse" => ["nullable", "string", "max:255"],
        ], [
            "raison_sociale.required" => "La raison sociale est obligatoire",
            "raison_sociale.string" => "La raison sociale doit être une chaîne de caractères",
            "raison_sociale.max" => "La raison sociale ne doit pas dépasser 255 caractères",
            "phone.string" => "Le numéro de téléphone doit être une chaîne de caractères",
            "phone.max" => "Le numéro de téléphone ne doit pas dépasser 255 caractères",
            "email.string" => "L'email doit être une chaîne de caractères",
            "email.max" => "L'email ne doit pas dépasser 255 caractères",
            "adresse.string" => "L'adresse doit être une chaîne de caractères",
            "adresse.max" => "L'adresse ne doit pas dépasser 255 caractères",
        ]);

        try {
            DB::beginTransaction();
            $fournisseur = Fournisseur::create([
                "raison_sociale" => $request->raison_sociale,
                "phone" => $request->phone,
                "email" => $request->email,
                "adresse" => $request->adresse,
            ]);

            DB::commit();
            Log::info("Nouveau fournisseur créé avec succès", ["fournisseur_id" => $fournisseur->id, "created_by" => auth()->user()->id]);
            return redirect()->route("fournisseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::debug("Erreure lors de la création du fournisseur", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du fournisseur"]);
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la création du fournisseur", ["error" => $e->getMessage()]);
            DB::rollBack();
            return back()->withErrors(["error" => "Une erreur est survenue lors de l'enregistrement du fournisseur"]);
        }
    }
}
