<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campagne extends Model
{
    protected $fillable = [
        "id",
        "reference",
        "libelle",
        "description",
        "createdBy_id",
        "validateBy_id"
    ];

    /**Createur */
    function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**Boot */
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->reference = "CAMP-" . time() . "-GNE";

            if (auth()->check()) {
                $model->createdBy_id = auth()->id();
            }
        });
    }
}
