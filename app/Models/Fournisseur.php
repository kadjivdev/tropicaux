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

    protected $appends = ["total_chargement_amount", "solde"];

    protected $fillable = [
        'raison_sociale',
        'phone',
        'adresse',
        'email',
        'user_id',
        "campagne_id"
    ];

    /**Chargments */
    function chargementDetails(): HasMany
    {
        return $this->hasMany(ChargementDetail::class, 'fournisseur_id');
    }

    /** Total chargement amount */
    function getTotalChargementAmountAttribute()
    {
        $sessionId = Session::get("campagne")?->id;

        return $this->chargementDetails()
            ->where("campagne_id", $sessionId)
            ->whereHas("chargement", fn($query) => $query->whereNotNull('validated_by')) //on tient compte juste de ceux dont les chargements sont validés
            ->get()
            ->sum(fn($detail) => $detail->amount); //
    }

    /**Financements */
    function financements(): HasMany
    {
        return $this->hasMany(Financement::class, 'fournisseur_id');
    }

    /**Depenses */
    function depenses(): HasMany
    {
        return $this->hasMany(DepenseFournisseur::class, 'fournisseur_id');
    }
    /**Solde fournisseur */
    function getSoldeAttribute()
    {
        return
            // les financements validés
            $this->financements
            ->whereNotNull("validated_at")
            ->sum(fn($financement) => $financement->reste)
            // le toatl des chargmeents
            - $this->total_chargement_amount
            // les depenses validées
            - $this->depenses()
            ->whereNotNull("validated_at")
            ->sum("montant");
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
