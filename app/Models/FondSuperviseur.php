<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FondSuperviseur extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'chargement_id',
        'superviseur_id',

        'montant',
        'document',
        'commentaire',

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

    /**Boot */
    protected static function booted()
    {
        static::creating(function ($model) {
            if (auth()->check()) {
                $model->user_id = auth()->id();
            }
            // Handle document uploading
            $model->document = $model->handleDocumentUploading();
        });
    }
}
