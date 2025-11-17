<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Session;

class Partenaire extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'raison_sociale',
        'adresse',
        'email',
        'phone',
        'user_id',
        "campagne_id"
    ];

    /**Ventes */
    function ventes(): HasMany
    {
        return $this->hasMany(Vente::class, 'partenaire_id');
    }

    /**Createur */
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
