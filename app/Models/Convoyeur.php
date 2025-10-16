<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Convoyeur extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'raison_sociale',
        'phone',
        'adresse',
        'email',
        'user_id',
    ];

    /**Createur */
    function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**Boot */
    protected static function booted()
    {
        static::creating(function ($produit) {
            if (auth()->check()) {
                $produit->user_id = auth()->id();
            }
        });
    }
}
