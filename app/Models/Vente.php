<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class Vente extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "reference",
        'partenaire_id',
        'chargement_id',
        'prix',

        'montant',
        'montant_total',
        'document',
        'poids',
        'nbre_sac_rejete',
        'prix_unitaire_sac_rejete',
        'commentaire',

        'validated_by',
        'validated_at',

        'user_id',
        'campagne_id'
    ];

    /*Casts*/
    protected $casts = [
        'prix' => 'decimal:2',
        'montant' => 'decimal:2',
        'poids' => 'decimal:2',
        'nbre_sac_rejete' => 'decimal:2',
        'prix_unitaire_sac_rejete' => 'decimal:2',
        'montant_total' => 'decimal:2',
        'validated_at' => 'date'
    ];

    /**Partenaire */
    function partenaire(): BelongsTo
    {
        return $this->belongsTo(Partenaire::class, 'partenaire_id');
    }

    /**Chargement */
    function chargement(): BelongsTo
    {
        return $this->belongsTo(chargement::class, 'chargement_id');
    }

    /**Camions */
    function camions(): HasMany
    {
        return $this->hasMany(VenteCamion::class, "vente_id");
    }

    /**Modes de paiement */
    function modes(): HasMany
    {
        return $this->hasMany(VenteModePaiement::class, "vente_id");
    }

    /**HandleDocument */
    function handleDocumentUploading()
    {
        $documentPath = null;
        $request = request();

        if ($request->hasFile('document')) {
            $file = $request->file('document');
            $name = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('documents'), $name);
            $documentPath = asset('documents/' . $name);
        }

        return $documentPath;
    }

    /**CreatedBy */
    function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**Validated by */
    function validatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    /**Boot */
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->campagne_id = Session::get("campagne")?->id;

            if (auth()->check()) {
                $model->user_id = auth()->id();
            }
            $model->reference = "VEN-" . time() . "-TE";

            // Handle document uploading
            $model->document = $model->handleDocumentUploading();

            /**les montants totaux */
            $montant = $model->poids * $model->prix;

            $model->montant = $montant;
            // montant total
            $model->montant_total = $montant + ($model->nbre_sac_rejete * $model->prix_unitaire_sac_rejete);
        });

        static::updating(function ($model) {
            /**les montants totaux */
            $montant = $model->poids * $model->prix;

            $model->montant = $montant;
            // montant total
            $model->montant_total = $montant + ($model->nbre_sac_rejete * $model->prix_unitaire_sac_rejete);

            // Handle document uploading
            Log::debug("Document de la vente",["doc"=>$model->handleDocumentUploading()]);
            $model->document = $model->handleDocumentUploading() ?? $model->document;
        });
    }
}
