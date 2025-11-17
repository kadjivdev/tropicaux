<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Session;

class Fournisseur extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'raison_sociale',
        'phone',
        'adresse',
        'email',
        'user_id',
        "campagne_id"
    ];

    /**Chargments */
    function chargements(): HasMany
    {
        return $this->hasMany(Chargement::class, 'fournisseur_id');
    }

    /**Financements */
    function financements(): HasMany
    {
        return $this->hasMany(Financement::class, 'fournisseur_id');
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
