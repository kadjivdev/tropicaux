<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class DepenseResource extends JsonResource
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
            "date" => $this->date ? Carbon::parse($this->date)->locale('fr')->isoFormat("D MMMM YYYY") : '---',
            "chargement" => $this->chargement->load("camions.camion"),
            "superviseur" => $this->superviseur,
            "montant" => $this->montant,
            "commentaire" => $this->commentaire,
            "document" => $this->document,
            "createdBy" => $this->createdBy,
            "validatedBy" => $this->validatedBy,
            "validated_at" => $this->validated_at ? Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY") : null
        ];
    }
}
