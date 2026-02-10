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
        $financementAmount = $this->financements
            ->whereNull("financement_id")
            ->whereNotNull("validated_by")
            ->sum("montant");

        return [
            "id" => $this->id,
            "reference" => $this->reference,
            "gestionnaire" => $this->gestionnaire,
            "prefinancement" => $this->prefinancement,
            // "_montant" => $this->montant,
            "montant" => number_format($this->montant, 2, ",", " "),
            "montant_dispatche" => number_format($financementAmount, 2, ",", " "),
            // "_back_amount" => $this->backAmount(),
            "transfered_amount" => number_format($this->transferedAmount(), 2, ",", " "),
            // "back_amount" => number_format($this->backAmount(), 2, ",", " ",),
            "_reste" => $this->reste(),
            "reste" => number_format($this->reste(), 2, ",", " "),
            "date_financement" => Carbon::parse($this->date_financement)->locale('fr')->isoFormat("D MMMM YYYY"),
            "document" => $this->document,
            "validatedBy" => $this->validatedBy,
            "createdBy" => $this->createdBy,
            "validated_at" => $this->validated_at ? Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY") : null
        ];
    }
}
