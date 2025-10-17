<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProduitController extends Controller
{
    /**
     * lister les produits
     */
    function index()
    {
        $produits = Produit::all();
        return inertia("Produits/List", [
            'produits' => $produits,
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        return inertia("Produits/Create");
    }

    /**
     * Store
     */
    function store(Request $request)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                "libelle"      => "required|string",
                "description"      => "nullable|string",
            ]);

            DB::beginTransaction();

            Produit::create($validated);

            DB::commit();
            return redirect()->route("produit.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du produit", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du produit", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
