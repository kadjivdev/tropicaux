<?php

namespace App\Http\Controllers;

use App\Models\GestionnaireFond;
use App\Models\Superviseur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GestionnaireFondController extends Controller
{
    /**
     * lister les gestionnaires
     */
    function index()
    {
        $gestionnaires = GestionnaireFond::all();
        return inertia("Gestionnaires/List", [
            'gestionnaires' => $gestionnaires,
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        return inertia("Gestionnaires/Create");
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
                'email' => "nullable|email|unique:superviseurs,email",
            ], [
                'raison_sociale.required' => 'Le nom de l’entreprise est obligatoire.',
                'raison_sociale.string' => 'Le nom de l’entreprise doit être une chaîne de caractères.',

                'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',

                'adresse.string' => 'L’adresse doit être une chaîne de caractères.',

                'email.email' => 'L’adresse e-mail doit être valide.',
                'email.unique' => 'Cette adresse e-mail est déjà utilisée.',
            ]);

            DB::beginTransaction();

            GestionnaireFond::create($validated);

            DB::commit();
            return redirect()->route("gestionnaire.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du gestionnaire", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du gestionnaire", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(GestionnaireFond $gestionnaire)
    {
        return inertia("Gestionnaires/Update", [
            'gestionnaire' => $gestionnaire,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, GestionnaireFond $gestionnaire)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                'raison_sociale' => "nullable|string",
                'phone' => "nullable|string",
                'adresse' => "nullable|string",
                'email' => "nullable|email|unique:chauffeurs,email," . $gestionnaire->id,
            ], [
                'raison_sociale.string' => 'Le nom de l’entreprise doit être une chaîne de caractères.',

                'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',

                'adresse.string' => 'L’adresse doit être une chaîne de caractères.',

                'email.email' => 'L’adresse e-mail doit être valide.',
                'email.unique' => 'Cette adresse e-mail est déjà utilisée.',
            ]);

            DB::beginTransaction();

            $gestionnaire->update($validated);

            DB::commit();
            return redirect()->route("gestionnaire.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du gestionnaire", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du gestionnaire", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(GestionnaireFond $gestionnaire)
    {
        try {
            DB::beginTransaction();

            if (!$gestionnaire) {
                throw new \Exception("Ce gestionnaire n'existe pas");
            }
            $gestionnaire->delete();

            DB::commit();
            return redirect()->route("gestionnaire.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du gestionnaire", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du gestionnaire", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
