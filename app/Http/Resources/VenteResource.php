<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VenteResource extends JsonResource
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
            "partenaire" => $this->partenaire,
            "prix" => $this->prix,
            "montant" => $this->montant,
            "document" => $this->document,
            "poids" => $this->poids,
            "nbre_sac_rejete" => $this->nbre_sac_rejete,
            "prix_unitaire_sac_rejete" => $this->prix_unitaire_sac_rejete,
            "montant_total" => $this->montant_total,
            "commentaire" => $this->commentaire,
            "createdBy" => $this->createdBy,
            "validated_at" => Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY")
        ];
    }
}
