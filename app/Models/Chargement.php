<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Chargement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'reference',
        'produit_id',
        'chauffeur_id',
        'superviseur_id',
        'convoyeur_id',
        'magasin_id',
        'adresse',
        'observation',
        'user_id',
        'validated_by',
        'validated_at'
    ];

    /**Casts */
    protected $casts = [
        'validated_at' => 'date'
    ];

    /**Produit */
    function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }

    /**Chauffeur */
    function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class, 'chauffeur_id');
    }

    /**Superviseur */
    function superviseur(): BelongsTo
    {
        return $this->belongsTo(Superviseur::class, 'superviseur_id');
    }

    /**Convoyeur */
    function convoyeur(): BelongsTo
    {
        return $this->belongsTo(Convoyeur::class, 'convoyeur_id');
    }

    /**Magasin */
    function magasin(): BelongsTo
    {
        return $this->belongsTo(Magasin::class, 'magasin_id');
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

    /**Detail */
    function details(): HasMany
    {
        return $this->hasMany(ChargementDetail::class, "chargement_id");
    }

    /**Camions */
    function camions(): HasMany
    {
        return $this->hasMany(ChargementCamion::class, "chargement_id");
    }

    /**Boot */
    protected static function booted()
    {
        static::creating(function ($chargement) {
            
            $chargement->reference = "CHARGE-" . time() . "-MENT";
            if (auth()->check()) {
                $chargement->user_id = auth()->id();
            }
        });
    }
}
