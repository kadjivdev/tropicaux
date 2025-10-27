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
            "reference" => $this->reference,
            "partenaire" => $this->partenaire,
            "prix" => $this->prix,
            "montant" => $this->montant,
            "document" => $this->document,
            "camions" => $this->camions->load("camion"),
            "modes" => $this->modes->load("mode"),
            "poids" => $this->poids,
            "nbre_sac_rejete" => $this->nbre_sac_rejete,
            "prix_unitaire_sac_rejete" => $this->prix_unitaire_sac_rejete,
            "montant_total" => $this->montant_total,
            "commentaire" => $this->commentaire,
            "createdBy" => $this->createdBy,
            "validatedBy" => $this->validatedBy,
            "validated_at" => $this->validated_at ? Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY") : $this->validated_at
        ];
    }
}
