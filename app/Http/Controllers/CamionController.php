<?php

namespace App\Http\Controllers;

use App\Models\Camion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CamionController extends Controller
{
   
    /**
     * lister les camions
     */
    function index()
    {
        $camions = Camion::all();
        return inertia("Camions/List", [
            'camions' => $camions,
        ]);
    }

    /**
     * Create
     */
    function create()
    {
        return inertia("Camions/Create");
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

            Camion::create($validated);

            DB::commit();
            return redirect()->route("camion.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du camion", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création du camion", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
