<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            "firstname" => $this->firstname,
            "lastname" => $this->lastname,
            "email" => $this->email,
            "detail" => $this->detail, //DetailResource::collection($this->detail),
            "roles" => $this->roles, //DetailResource::collection($this->detail),
            "created_at" => Carbon::parse($this->created_at)->locale("fr")->isoFormat("D MMMM YYYY"), //DetailResource::collection($this->detail),
        ];
    }
}
