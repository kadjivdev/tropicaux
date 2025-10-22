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
            "chargement" => ChargementResource::collection($this->chargement),
            "superviseur" => $this->superviseur,
            "montant" => $this->montant,
            "commentaire" => $this->commentaire,
            "document" => $this->document,
            "createdBy" => $this->createdBy,
            "validated_at" => Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY")
        ];
    }
}
