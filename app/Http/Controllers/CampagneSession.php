<?php

namespace App\Http\Controllers;

use App\Models\Campagne;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class CampagneSession extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function campagneSession(Request $request, Campagne $campagne)
    {
        try {
            DB::beginTransaction();
            Session::put("campagne", $campagne);

            DB::commit();
            Log::debug("Session de campagne au niveau de la création des session :", ["session" => Session::get("campagne")]);
            return back()->with("success", "Session de campagne generé avec succès");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la creation de Session de campagne :", ["session" => $e->getMessage()]);
            return back()->with(["exception" => $e->getMessage()]);
        }
    }
}
