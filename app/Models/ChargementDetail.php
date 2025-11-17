<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Session;

class ChargementDetail extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'chargement_id',
        'fournisseur_id',
        'campagne_id',

        'sac_jute',
        'sac_pp',
        'tonnage',
        'prix_achat',

        'user_id',
    ];

    /*Casts*/
    protected $casts = [
        'sac_jute' => 'decimal:2',
        'sac_pp' => 'decimal:2',
        'tonnage' => 'decimal:2',
        'prix_achat' => 'decimal:2',
    ];

    /**Chargement */
    function chargement(): BelongsTo
    {
        return $this->belongsTo(Chargement::class, 'chargement_id');
    }

    /**Fournisseur */
    function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class, 'fournisseur_id');
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
            $model->campagne_id = Session::get("campagne")?->id;

            if (auth()->check()) {
                $model->user_id = auth()->id();
            }
        });
    }
}
