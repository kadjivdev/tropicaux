<?php

namespace App\Http\Controllers;

use App\Models\Chauffeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChauffeurController extends Controller
{
    /**
     * lister les chauffeurs
     */
    function index()
    {
        $chauffeurs = Chauffeur::all();
        return inertia("Chauffeurs/List", [
            'chauffeurs' => $chauffeurs,
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        return inertia("Chauffeurs/Create");
    }

    /**
     * Store
     */
    function store(Request $request)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                'raison_sociale' => "required|string",
                'phone' => "nullable|string",
                'adresse' => "nullable|string",
                'email' => "nullable|email|unique:chauffeurs,email",
            ], [
                'raison_sociale.required' => 'Le nom de l’entreprise est obligatoire.',
                'raison_sociale.string' => 'Le nom de l’entreprise doit être une chaîne de caractères.',

                'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',

                'adresse.string' => 'L’adresse doit être une chaîne de caractères.',

                'email.email' => 'L’adresse e-mail doit être valide.',
                'email.unique' => 'Cette adresse e-mail est déjà utilisée.',
            ]);

            DB::beginTransaction();

            Chauffeur::create($validated);

            DB::commit();
            return redirect()->route("chauffeur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du chauffeur", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du chauffeur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Chauffeur $chauffeur)
    {
        return inertia("Chauffeurs/Update", [
            'chauffeur' => $chauffeur,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Chauffeur $chauffeur)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                'raison_sociale' => "nullable|string",
                'phone' => "nullable|string",
                'adresse' => "nullable|string",
                'email' => "nullable|email|unique:chauffeurs,email," . $chauffeur->id,
            ], [
                'raison_sociale.string' => 'Le nom de l’entreprise doit être une chaîne de caractères.',

                'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',

                'adresse.string' => 'L’adresse doit être une chaîne de caractères.',

                'email.email' => 'L’adresse e-mail doit être valide.',
                'email.unique' => 'Cette adresse e-mail est déjà utilisée.',
            ]);

            DB::beginTransaction();

            $chauffeur->update($validated);

            DB::commit();
            return redirect()->route("chauffeur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du chauffeur", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du chauffeur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(Chauffeur $chauffeur)
    {
        try {
            DB::beginTransaction();

            if (!$chauffeur) {
                throw new \Exception("Ce Chauffeur n'existe pas");
            }
            $chauffeur->delete();

            DB::commit();
            return redirect()->route("chauffeur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du chauffeur", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du chauffeur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
