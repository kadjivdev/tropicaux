<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SoldeRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "montant" => "required|numeric",
            "commentaire" => "nullable|string",
            "preuve" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],

            "fournisseur_id" => "required|integer|exists:fournisseurs,id",
        ];
    }
}
