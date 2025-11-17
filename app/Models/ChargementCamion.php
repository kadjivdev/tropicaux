<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Session;

class ChargementCamion extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'chargement_id',
        'camion_id',
        'commentaire',
        'user_id',
        'campagne_id'
    ];

    /**Chargement */
    function chargement(): BelongsTo
    {
        return $this->belongsTo(Chargement::class, 'chargement_id');
    }

    /**Camion */
    function camion(): BelongsTo
    {
        return $this->belongsTo(Camion::class, 'camion_id');
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
