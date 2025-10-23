<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;

class FondSuperviseur extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "reference",
        'chargement_id',
        'superviseur_id',

        'montant',
        'document',
        'commentaire',

        'validated_by',
        'validated_at',

        'user_id',
    ];

    /*Casts*/
    protected $casts = [
        'montant' => 'decimal:2',
    ];

    /**Chargement */
    function chargement(): BelongsTo
    {
        return $this->belongsTo(Chargement::class, 'chargement_id');
    }

    /**Superviseur */
    function superviseur(): BelongsTo
    {
        return $this->belongsTo(Superviseur::class, 'superviseur_id');
    }

    /**HandleDocument */
    function handleDocumentUploading()
    {
        $documentPath = null;
        $request = request();

        Log::debug("Document handling ...", ["document" => $request->file('document')]);
        if ($request->hasFile('document')) {
            Log::debug("Document existe ...", ["document" => $request->file('document')]);
            $file = $request->file('document');
            $name = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('documents'), $name);
            $documentPath = asset('documents/' . $name);
        }

        Log::debug("documentPath handling ...", ["documentPath" => $documentPath]);
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
            $model->reference = "FOND-" . time() . "-SUP";

            // Handle document uploading
            $model->document = $model->handleDocumentUploading();
        });
    }
}
