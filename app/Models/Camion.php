<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Session;

class Camion extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'libelle',
        'description',
        'user_id',
        "campagne_id"
    ];

    /**Createur */
    function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**Boot */
    protected static function booted()
    {
        static::creating(function ($camion) {
            $camion->campagne_id = Session::get("campagne")?->id;

            if (auth()->check()) {
                $camion->user_id = auth()->id();
            }
        });
    }
}
