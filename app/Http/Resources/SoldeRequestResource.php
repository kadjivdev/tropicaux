<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SoldeRequestResource extends JsonResource
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
            "numero" => $this->numero,
            "fournisseur" => $this->fournisseur,
            "montant" => number_format($this->montant,2,","," "),
            "commentaire" => $this->commentaire,
            "preuve" => $this->preuve,

            "createdBy" => $this->createdBy,
            "createdAt" => $this->created_at ? Carbon::parse($this->created_at)->locale("fr")->isoFormat("D MMMM YYYY") : null,

            "validatedBy" => $this->validatedBy,
            "validatedAt" => $this->validated_at ? Carbon::parse($this->validated_at)->locale("fr")->isoFormat("D MMMM YYYY") : null,
        ];
    }
}
