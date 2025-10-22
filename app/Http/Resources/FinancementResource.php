<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class FinancementResource extends JsonResource
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
            "fournisseur" => $this->fournisseur,
            "gestionnaire" => $this->gestionnaire,
            "montant" => number_format($this->montant, 2, ",", " "),
            "date_financement" => Carbon::parse($this->date_financement)->locale('fr')->isoFormat("D MMMM YYYY"),
            "document" => $this->document,
            "validatedBy" => $this->validatedBy,
            "createdBy" => $this->createdBy,
            "validated_at" => $this->validated_at ? Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY"):null
        ];
    }
}
