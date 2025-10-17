<?php

namespace App\Http\Controllers;

use App\Models\Chauffeur;
use App\Models\Superviseur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SuperviseurController extends Controller
{
    /**
     * lister les superviseurs
     */
    function index()
    {
        $superviseurs = Superviseur::all();
        return inertia("Superviseurs/List", [
            'superviseurs' => $superviseurs,
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        return inertia("Superviseurs/Create");
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

            Superviseur::create($validated);

            DB::commit();
            return redirect()->route("superviseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du superviseur", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du superviseur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Superviseur $superviseur)
    {
        return inertia("Superviseurs/Update", [
            'superviseur' => $superviseur,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Superviseur $superviseur)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                'raison_sociale' => "nullable|string",
                'phone' => "nullable|string",
                'adresse' => "nullable|string",
                'email' => "nullable|email|unique:chauffeurs,email," . $superviseur->id,
            ], [
                'raison_sociale.string' => 'Le nom de l’entreprise doit être une chaîne de caractères.',

                'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',

                'adresse.string' => 'L’adresse doit être une chaîne de caractères.',

                'email.email' => 'L’adresse e-mail doit être valide.',
                'email.unique' => 'Cette adresse e-mail est déjà utilisée.',
            ]);

            DB::beginTransaction();

            $superviseur->update($validated);

            DB::commit();
            return redirect()->route("superviseur.index");
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
    function destroy(Superviseur $superviseur)
    {
        try {
            DB::beginTransaction();

            if (!$superviseur) {
                throw new \Exception("Ce superviseur n'existe pas");
            }
            $superviseur->delete();

            DB::commit();
            return redirect()->route("superviseur.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du superviseur", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du superviseur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
