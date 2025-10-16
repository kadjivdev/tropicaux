<?php

namespace App\Http\Controllers;

use App\Http\Resources\DevoirResource;
use App\Http\Resources\InterrogationResource;
use App\Models\Apprenant;
use App\Models\Trimestre;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BulletinController extends Controller
{
    /**
     * Handle the incoming request.
     */
    function __invoke(Request $request, Trimestre $trimestre)
    {
        if (Auth::user()->school) {
            $apprenants = Apprenant::with(["school", "parent", "classe", "serie"])->latest()
                ->where("school_id", Auth::user()->school_id)->get();
        } else {
            $apprenants = Apprenant::with(["school", "parent", "classe", "serie"])->latest()->get();
        }

        /**
         * Moyennes formatage
         */
        $apprenants->transform(function ($apprenant) use ($trimestre) {
            $matieres = $apprenant->school->matieres;

            $apprenant->matieres = $matieres->map(function ($matiere) use ($apprenant, &$trimestre) {
                $matiere_interros = $apprenant->interrogations()
                    ->where(["matiere_id" => $matiere->id, "trimestre_id" => $trimestre->id])->get();

                /** */
                return [
                    "id" => $matiere->id,
                    "libelle" => $matiere->libelle,
                    "interrogations" => [],
                    "moyenne_interro" => !$matiere_interros->isEmpty() ? $matiere_interros->sum("note") / $matiere_interros->count() : 0
                ];
            });

            return $apprenant;
        });

        return Inertia::render('Bulletin/List', [
            'apprenants' => $apprenants,
            "trimestre" => $trimestre
        ]);
    }

    /**
     * Generate un bulletin
     */

    function generateBulletin(Request $request, Trimestre $trimestre, Apprenant $apprenant)
    {
        try {
            $apprenant->load(["school", "parent", "classe.apprenants", "serie"]);

            // Log::info("Les données entrantes", ["data" => $apprenant]);

            /**
             * Moyennes formatage
             */
            $matieres = $apprenant->school->matieres->map(function ($matiere) use ($apprenant, $trimestre) {
                $matiere_interros = $apprenant->interrogations()
                    ->where(["matiere_id" => $matiere->id, "trimestre_id" => $trimestre->id])
                    ->get();

                $matiere_devoirs = $apprenant->devoirs()
                    ->where(["matiere_id" => $matiere->id, "trimestre_id" => $trimestre->id])
                    ->get();

                $moyenne_interro = !$matiere_interros->isEmpty()
                    ? $matiere_interros->sum("note") / $matiere_interros->count()
                    : 0;

                $sommeDevoirsNote = $matiere_devoirs->sum("note");
                $moyenne = ($moyenne_interro + $sommeDevoirsNote) / 3;
                $moyenneCoefficie = $moyenne * $matiere->coefficient;

                return (object) [
                    "id" => $matiere->id,
                    "libelle" => $matiere->libelle,
                    "coefficient" => $matiere->coefficient,
                    "interrogations" => InterrogationResource::collection($matiere_interros),
                    "devoirs" => DevoirResource::collection($matiere_devoirs),
                    "moyenne_interro" => $moyenne_interro,
                    "moyenne" => $moyenne,
                    "moyenne_coefficie" => $moyenneCoefficie,

                    "moyenne_failble" => 10,
                    "moyenne_forte" => 18,

                    "rang" => 3,
                ];
            });

            $apprenant->matieres = $matieres;
            $apprenant->rang = 3;
            $apprenant->statut = 'Passant';
            $apprenant->period = '2023-2024';

            set_time_limit(0);
            $pdf = Pdf::loadView("pdfs.bulletins.bulletin", [
                "apprenant" => $apprenant,
                "trimestre" => $trimestre,
            ]);

            // Set PDF orientation to landscape
            $pdf->setPaper('a4', 'landscape');

            return $pdf->stream();
        } catch (\Exception $e) {
            Log::debug("Eureure lors de la generation du bulletin", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
