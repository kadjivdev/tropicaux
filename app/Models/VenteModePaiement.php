<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class VenteModePaiement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'vente_id',
        'paiement_mode_id',

        'commentaire',
        'user_id',
    ];

    /**Partenaire */
    function partenaire(): BelongsTo
    {
        return $this->belongsTo(Partenaire::class, 'partenaire_id');
    }

    /**Paiement Mode */
    function mode(): BelongsTo
    {
        return $this->belongsTo(PaiementMode::class, 'paiement_mode_id');
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
        });
    }
}
