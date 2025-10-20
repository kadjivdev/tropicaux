<?php

namespace App\Http\Controllers;

use App\Models\Magasin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MagasinController extends Controller
{
    /**
     * lister les magasins
     */
    function index()
    {
        $magasins = Magasin::all();
        return inertia("Magasins/List", [
            'magasins' => $magasins,
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        return inertia("Magasins/Create");
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

            Magasin::create($validated);

            DB::commit();
            return redirect()->route("magasin.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du magasin", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du magasin", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
