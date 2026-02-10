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

        $backAmount = $this->backAmount();

        return [
            "id" => $this->id,
            "reference" => $this->reference,
            "fournisseur" => $this->fournisseur,
            "prefinancement" => $this->preFinancement,
            "financement" => $this->financement,
            "_back_amount" => $backAmount,
            "_reste_back" => $backAmount - $this->transferedAmount(),
            "reste_back" => number_format($backAmount - $this->transferedAmount(), 2, ",", " "),
            "back_amount" => number_format($backAmount, 2, ",", " "),
            "montant_r" => $this->montant_r(),
            "transfered_amount" => number_format($this->transferedAmount(), 2, ",", " "),
            "reste" => number_format($this->reste(), 2, ",", " "),
            "montant" => number_format($this->montant, 2, ",", " "),
            "date_financement" => Carbon::parse($this->date_financement)->locale('fr')->isoFormat("D MMMM YYYY"),
            "document" => $this->document,
            "preFinancement" => $this->preFinancement,
            "validatedBy" => $this->validatedBy,
            "createdBy" => $this->createdBy,
            "validated_at" => $this->validated_at ? Carbon::parse($this->validated_at)->locale('fr')->isoFormat("D MMMM YYYY") : null
        ];
    }
}
