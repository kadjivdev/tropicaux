<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FournisseurResource extends JsonResource
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
            "raison_sociale" => $this->raison_sociale,
            "phone" => $this->phone,
            "email" => $this->email,
            "adresse" => $this->adresse,
            "createdBy" => $this->createdBy,//UserResource::collection(),
            "created_at" => Carbon::parse($this->created_at)->locale("fr")->isoFormat("D MMMM YYYY"),
            "updated_at" => Carbon::parse($this->updated_at)->locale("fr")->isoFormat("D MMMM YYYY"),
        ];
    }
}
