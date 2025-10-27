<?php

namespace App\Http\Controllers;

use App\Models\Partenaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PartenaireController extends Controller
{
    /**
     * lister les partenaires
     */
    function index()
    {
        $partenaires = Partenaire::all();
        return inertia("Partenaires/List", [
            'partenaires' => $partenaires,
        ]);
    }

    /**
     * liste les ventes
     */
    function ventes(Partenaire $partenaire)
    {
        $total_amount = $partenaire->ventes->whereNotNull("validated_at")->sum("montant_total");
        $partenaire->load("ventes.camions.camion","ventes.modes.mode","ventes.createdBy","ventes.validatedBy");

        // return $partenaire;
        return inertia("Partenaires/Ventes", [
            "total_amount" => number_format($total_amount, 2, ",", " "),
            'partenaire' => $partenaire,
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        return inertia("Partenaires/Create");
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
                'email' => "nullable|email|unique:partenaires,email",
            ], [
                'raison_sociale.required' => 'Le nom de l’entreprise est obligatoire.',
                'raison_sociale.string' => 'Le nom de l’entreprise doit être une chaîne de caractères.',

                'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',

                'adresse.string' => 'L’adresse doit être une chaîne de caractères.',

                'email.email' => 'L’adresse e-mail doit être valide.',
                'email.unique' => 'Cette adresse e-mail est déjà utilisée.',
            ]);

            DB::beginTransaction();

            Partenaire::create($validated);

            DB::commit();
            return redirect()->route("partenaire.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du partenaire", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du partenaire", ["error" => $e->getMessage()]);
            return back()->withErrors(["error" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(Partenaire $partenaire)
    {
        return inertia("Partenaires/Update", [
            'partenaire' => $partenaire,
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, Partenaire $partenaire)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                'raison_sociale' => "nullable|string",
                'phone' => "nullable|string",
                'adresse' => "nullable|string",
                'email' => "nullable|email|unique:partenaires,email," . $partenaire->id,
            ], [
                'raison_sociale.string' => 'Le nom de l’entreprise doit être une chaîne de caractères.',

                'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',

                'adresse.string' => 'L’adresse doit être une chaîne de caractères.',

                'email.email' => 'L’adresse e-mail doit être valide.',
                'email.unique' => 'Cette adresse e-mail est déjà utilisée.',
            ]);

            DB::beginTransaction();

            $partenaire->update($validated);

            DB::commit();
            return redirect()->route("partenaire.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du partenaire", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification du partenaire", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(Partenaire $partenaire)
    {
        try {
            DB::beginTransaction();

            if (!$partenaire) {
                throw new \Exception("Ce partenaire n'existe pas");
            }
            $partenaire->delete();

            DB::commit();
            return redirect()->route("partenaire.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du partenaire", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la suppression du partenaire", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
