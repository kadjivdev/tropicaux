<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartenaireResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            "id" => $this->id,
            "raison_sociale" => $this->raison_sociale,
            "adresse" => $this->adresse,
            "email" => $this->email,
            "phone" => $this->phone,
            "total_ventes" => number_format($this->ventes()->whereNotNull("validated_by")->sum("montant_total"),2,","," "),
            "createdBy" => $this->createdBy,
        ];
    }
}
