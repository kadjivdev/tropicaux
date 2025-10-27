<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class VenteCamion extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'vente_id',
        'camion_id',

        'commentaire',
        'user_id',
    ];

    /**Partenaire */
    function partenaire(): BelongsTo
    {
        return $this->belongsTo(Partenaire::class, 'partenaire_id');
    }

    /**Camion */
    function camion(): BelongsTo
    {
        return $this->belongsTo(Camion::class, 'camion_id');
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
