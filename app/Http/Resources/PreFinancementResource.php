<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class PreFinancementResource extends JsonResource
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
            "gestionnaire" => $this->gestionnaire,
            "prefinancement" => $this->prefinancement,
            "montant" => number_format($this->montant, 2, ",", " "),
            "montant_dispatche" => number_format($this->financements->whereNotNull("validated_by")->sum("montant"), 2, ",", " "),
            "back_amount" => number_format($this->backAmount(),2,","," ",),
            "reste" => $this->reste(),
            "date_financement" => Carbon::parse($this->date_financement)->locale('fr')->isoFormat("D MMMM YYYY"),
            "document" => $this->document,
            "validatedBy" => $this->validatedBy,
            "createdBy" => $this->createdBy,
            "validated_at" => $this->validated_at ? Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY") : null
        ];
    }
}
