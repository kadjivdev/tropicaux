<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            "numero"=>$this->numero,
            "produit" => $this->produit,
            "chauffeur" => $this->chauffeur,
            "superviseur" => $this->superviseur,
            "convoyeur" => $this->convoyeur,
            "magasin" => $this->magasin,
        ];
    }
}
