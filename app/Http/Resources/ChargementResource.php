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
            "produit" => $this->produit,
            "chauffeur" => $this->chauffeur,
            "superviseur" => $this->superviseur,
            "convoyeur" => $this->convoyeur,
            "magasin" => $this->magasin,
            "adresse" => $this->adresse,
            "observation" => $this->observation,
            "createdBy" => $this->createdBy,
            "validatedBy" => $this->validatedBy,
            "validated_at" => Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY")
        ];
    }
}
