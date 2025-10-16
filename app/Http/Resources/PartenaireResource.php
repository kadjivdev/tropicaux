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
            "createdBy" => UserResource::collection($this->createdBy),
        ];
    }
}
