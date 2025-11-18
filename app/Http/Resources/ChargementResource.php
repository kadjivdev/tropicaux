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
        return [
            "id" => $this->id,
            "reference" => $this->reference,
            "produit" => $this->produit,
            "chauffeur" => $this->chauffeur,
            "superviseur" => $this->superviseur,
            "convoyeur" => $this->convoyeur,
            "magasin" => $this->magasin,
            "camions" => $this->camions->load("camion"),
            "details" => $this->details->load("fournisseur"),
            "total_fonds" => number_format($this->fonds->whereNotNull("validated_by")->sum("montant"),2,","," "),
            "total_depenses" => number_format($this->depenses->whereNotNull("validated_by")->sum("montant"),2,","," "),
            "adresse" => $this->adresse,
            "observation" => $this->observation,
            "createdBy" => $this->createdBy,
            "validatedBy" => $this->validatedBy,
            "validated_at" => $this->validated_at ? Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY") : null
        ];
    }
}
