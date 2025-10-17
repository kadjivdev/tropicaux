<?php

namespace App\Http\Controllers;

use App\Models\PaiementMode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaiementModeController extends Controller
{
    /**
     * lister les modes de paiement
     */
    function index()
    {
        $modesPaiement = PaiementMode::all();
        return inertia("PaiementModes/List", [
            'modes' => $modesPaiement,
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        return inertia("PaiementModes/Create");
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

            PaiementMode::create($validated);

            DB::commit();
            return redirect()->route("mode-paiement.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du mode de paiement", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du mode de paiment", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
