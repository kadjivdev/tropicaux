<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vente extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "reference",
        'partenaire_id',
        'prix',

        'montant',
        'document',
        'poids',
        'nbre_sac_rejete',
        'prix_unitaire_sac_rejete',
        'montant_total',
        'commentaire',

        'validated_by',
        'validated_at',

        'user_id',
    ];

    /*Casts*/
    protected $casts = [
        'prix' => 'decimal:2',
        'montant' => 'decimal:2',
        'poids' => 'decimal:2',
        'nbre_sac_rejete' => 'decimal:2',
        'prix_unitaire_sac_rejete' => 'decimal:2',
        'montant_total' => 'decimal:2',
        'validated_at' => 'date'
    ];

    /**Partenaire */
    function partenaire(): BelongsTo
    {
        return $this->belongsTo(Partenaire::class, 'partenaire_id');
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
            if (auth()->check()) {
                $model->user_id = auth()->id();
            }
            $model->reference = "VEN-" . time() . "-TE";

            // Handle document uploading
            $model->document = $model->handleDocumentUploading();
        });
    }
}
