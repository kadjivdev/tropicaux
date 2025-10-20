<?php

namespace App\Http\Controllers;

use App\Models\Convoyeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ConvoyeurController extends Controller
{
    /**
     * lister les convoyeurs
     */
    function index()
    {
        $convoyeurs = Convoyeur::all();
        return inertia("Convoyeurs/List", [
            'convoyeurs' => $convoyeurs,
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        return inertia("Convoyeurs/Create");
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
                'email' => "nullable|email|unique:convoyeurs,email",
            ], [
                'raison_sociale.required' => 'Le nom de l’entreprise est obligatoire.',
                'raison_sociale.string' => 'Le nom de l’entreprise doit être une chaîne de caractères.',

                'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',

                'adresse.string' => 'L’adresse doit être une chaîne de caractères.',

                'email.email' => 'L’adresse e-mail doit être valide.',
                'email.unique' => 'Cette adresse e-mail est déjà utilisée.',
            ]);

            DB::beginTransaction();

            Convoyeur::create($validated);

            DB::commit();
            return redirect()->route("convoyeur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du Convoyeur", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du Convoyeur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Convoyeur $Convoyeur)
    {
        return inertia("Convoyeurs/Update", [
            'convoyeur' => $Convoyeur,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Convoyeur $Convoyeur)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                'raison_sociale' => "nullable|string",
                'phone' => "nullable|string",
                'adresse' => "nullable|string",
                'email' => "nullable|email|unique:convoyeurs,email," . $Convoyeur->id,
            ], [
                'raison_sociale.string' => 'Le nom de l’entreprise doit être une chaîne de caractères.',

                'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',

                'adresse.string' => 'L’adresse doit être une chaîne de caractères.',

                'email.email' => 'L’adresse e-mail doit être valide.',
                'email.unique' => 'Cette adresse e-mail est déjà utilisée.',
            ]);

            DB::beginTransaction();

            $Convoyeur->update($validated);

            DB::commit();
            return redirect()->route("convoyeur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du Convoyeur", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du Convoyeur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(Convoyeur $Convoyeur)
    {
        try {
            DB::beginTransaction();

            if (!$Convoyeur) {
                throw new \Exception("Ce Convoyeur n'existe pas");
            }
            $Convoyeur->delete();

            DB::commit();
            return redirect()->route("convoyeur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du Convoyeurs", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du Convoyeurs", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
