<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Session;

class DepenseFournisseur extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "reference",
        'fournisseur_id',

        'montant',
        'document',
        'commentaire',

        'validated_by',
        'validated_at',

        'user_id',
        'campagne_id'
    ];

    /*Casts*/
    protected $casts = [
        'montant' => 'decimal:2',
    ];

    /**Fournisseur */
    function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class, 'fournisseur_id');
    }

    /**HandleDocument */
    function handleDocumentUploading()
    {
        $documentPath = null;
        $request = request();

        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $name = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('documents'), $name);
            $documentPath = asset('documents/' . $name);
        }

        return $documentPath;
    }

    /**CreatedBy */
    function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**Validated by */
    function validatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    /**Boot */
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->campagne_id = Session::get("campagne")?->id;

            if (auth()->check()) {
                $model->user_id = auth()->id();
            }
            $model->reference = "DEPEN-FRS-" . time() . "-SEUR";

            // Handle document uploading
            $model->document = $model->handleDocumentUploading();
        });
    }

    /**
     * Validation rules
     */

    static function rules(): array
    {
        return [
            "fournisseur_id" => "required|exists:fournisseurs,id",
            "montant" => ["required", "numeric"],
            "commentaire" => ["nullable"],
            "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
        ];
    }

    static function messages(): array
    {
        return [
            'fournisseur_id.required' => 'Le fournisseur est obligatoire.',
            'fournisseur_id.exists'   => 'Le fournisseur sélectionnée est invalide.',

            'montant.required' => 'Le montant est obligatoire.',
            'montant.numeric'  => 'Le montant doit être un nombre valide.',

            'commentaire.nullable' => 'Le commentaire peut être laissé vide.',

            'document.file'   => 'Le document doit être un fichier.',
            'document.mimes'  => 'Le document doit être au format PDF, PNG, JPG ou JPEG.',
        ];
    }
}
