<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class ChargementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $camionsVendus = $this->ventes->whereNotNull("validated_by")
            ->flatten()->pluck("camions")->flatten(); //les camions vendus

        switch ($camionsVendus->count()) {
            case 0:
                $statut = "Non vendu";
                break;
            case $this->camions->count():
                $statut = "Entièrement vendu";
                break;
            default:
                $statut = "Partiellement vendu";
                break;
        }

        return [
            "id" => $this->id,
            "reference" => $this->reference,
            "produit" => $this->produit,
            "chauffeur" => $this->chauffeur,
            "superviseur" => $this->superviseur,
            "convoyeur" => $this->convoyeur,
            "magasin" => $this->magasin,
            "total_amount" => $this->total_amount ? number_format($this->total_amount, 2, ",", " ") : '---',
            "_total_amount" => $this->total_amount,
            "total_amount" => $this->total_amount ? number_format($this->total_amount, 2, ",", " ") : '---',
            "montant_final" => $this->montant_final ? number_format($this->montant_final, 2, ",", " ") : '---',
            "camions" => $this->camions->load("camion"),
            "camions_vendus" => $camionsVendus, //les camions vendus,
            "statut" => $statut,
            "details" => $this->details->load("fournisseur"),
            "total_fonds" => number_format($this->fonds()->whereNotNull("validated_by")->sum("montant"), 2, ",", " "),
            "total_depenses" => number_format($this->depenses()->whereNotNull("validated_by")->sum("montant"), 2, ",", " "),
            "total_depenses_generales" => number_format($this->depensesGenerales()->whereNotNull("validated_by")->sum("montant"), 2, ",", " "),
            "adresse" => $this->adresse,
            "observation" => $this->observation,
            "createdBy" => $this->createdBy,
            "validatedBy" => $this->validatedBy,
            "validated_at" => $this->validated_at ? Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY") : null
        ];
    }
}
