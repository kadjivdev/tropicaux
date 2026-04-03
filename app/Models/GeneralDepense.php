<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Session;

class GeneralDepense extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "reference",
        'type_id',
        'chargement_id',

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

    /**Type */
    function type(): BelongsTo
    {
        return $this->belongsTo(DepenseGeneraleType::class, 'type_id');
    }

    /**Chargement */
    function chargement(): BelongsTo
    {
        return $this->belongsTo(Chargement::class, 'chargement_id');
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
            $model->reference = "DEPEN-" . time() . "-GEN";

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
            "type_id" => "required|exists:depense_generale_types,id",
            "chargement_id" => "required|exists:chargements,id",
            "montant" => ["required", "numeric"],
            "commentaire" => ["nullable"],
            "document" => ["nullable", "file", "mimes:pdf,png,jpg,jpeg"],
        ];
    }

    static function messages(): array
    {
        return [
            'type_id.required' => 'Le type est obligatoire.',
            'type_id.exists'   => 'Le type sélectionné est invalide.',

            'chargement_id.required' => 'Le chargement est obligatoire.',
            'chargement_id.exists'   => 'Le chargement sélectionné est invalide.',

            'montant.required' => 'Le montant est obligatoire.',
            'montant.numeric'  => 'Le montant doit être un nombre valide.',

            'commentaire.nullable' => 'Le commentaire peut être laissé vide.',

            'document.file'   => 'Le document doit être un fichier.',
            'document.mimes'  => 'Le document doit être au format PDF, PNG, JPG ou JPEG.',
        ];
    }
}
