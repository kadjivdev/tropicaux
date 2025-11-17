<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class Financement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "reference",
        'fournisseur_id',
        'gestionnaire_id',
        'montant',
        'date_financement',
        'document',
        'user_id',
        'validated_by',
        'validated_at',
        "campagne_id"
    ];

    /**Cast */
    protected $casts = [
        'date_financement' => 'date',
        'montant' => 'decimal:2',
        'validated_at' => 'date'
    ];

    /**Fournisseur */
    function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class, 'fournisseur_id');
    }

    /**Gestionnaire */
    function gestionnaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'gestionnaire_id');
    }

    /**Handle document */
    public function handleDocumentUploading()
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

    /**Createur */
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
        static::creating(function ($financement) {
            $financement->campagne_id = Session::get("campagne")?->id;

            if (auth()->check()) {
                $financement->user_id = auth()->id();
            }
            
            $financement->reference = "FINAN-" . time() . "-CE";
            /**insertion du document */
            $financement->document = $financement->handleDocumentUploading();
        });
    }
}
