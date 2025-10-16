<?php

namespace App\Http\Controllers;

use App\Http\Resources\InterrogationResource;
use App\Models\Apprenant;
use App\Models\School;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MoyenneInterrogationController extends Controller
{
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
            // $trimestres = $apprenant->school->trimestres;

            $apprenant->matieres = $matieres->map(function ($matiere) use ($apprenant, &$trimestre) {
                $matiere_interros = $apprenant->interrogations()
                    ->where(["matiere_id" => $matiere->id, "trimestre_id" => $trimestre->id])->get();

                /** */
                return [
                    "id" => $matiere->id,
                    "libelle" => $matiere->libelle,
                    "interrogations" => InterrogationResource::collection($matiere_interros),
                    "moyenne_interro" => !$matiere_interros->isEmpty() ? $matiere_interros->sum("note") / $matiere_interros->count() : 0
                ];
            });

            return $apprenant;
        });


        // return response()->json($apprenants);
        return Inertia::render('MoyennesInterro/List', [
            'apprenants' => $apprenants,
            "trimestre" => $trimestre
        ]);
    }
}
