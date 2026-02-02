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
        $depenses = $this->depenses->whereNotNull("validated_at")->sum("montant");
        return [
            "id" => $this->id,
            "reference" => $this->reference,
            "partenaire" => $this->partenaire,
            "chargement" => $this->chargement,
            "prix" => $this->prix,
            "montant" => number_format($this->montant, 2, "."),
            "document" => $this->document,
            "camions" => $this->camions->load("camion"),
            "modes" => $this->modes->load("mode"),
            "poids" => $this->poids,
            "nbre_sac_rejete" => $this->nbre_sac_rejete,
            "prix_unitaire_sac_rejete" => $this->prix_unitaire_sac_rejete,
            "depense_total" => number_format($depenses, 2, "."), //depenses validées
            "montant_total" => number_format($this->montant_total - $depenses, 2, "."),
            "commentaire" => $this->commentaire,
            "createdBy" => $this->createdBy,
            "validatedBy" => $this->validatedBy,
            "validated_at" => $this->validated_at ? Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY") : $this->validated_at
        ];
    }
}
