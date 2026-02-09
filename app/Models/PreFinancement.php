<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Session;

class PreFinancement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "reference",
        'gestionnaire_id',
        'montant',
        'reste',
        'reste_transfere',
        'prefinancement_id',
        'date_financement',
        'document',
        'user_id',
        'validated_by',
        'validated_at',
        "campagne_id"
    ];


    /**Cast */
    protected $casts = [
        'date_financement' => 'date',
        'montant' => 'decimal:2',
        'reste' => 'decimal:2',
        'reste_transfere' => 'decimal:2',
        'validated_at' => 'date'
    ];

    //Montant retournés
    function backAmount()
    {
        return
            // les retours de financements
            $this->financements
            ->whereNotNull("validated_by")
            ->sum(function ($financement) {
                return $financement->backAmount();
            })
            -
            // - les transferts effectués vers d'autres prefinancements
            $this->prefinancements
            ->whereNotNull("validated_by")
            ->sum("montant");
    }

    function reste()
    {
        return $this->montant - $this->backAmount();
    }

    /**Gestionnaire */
    function gestionnaire(): BelongsTo
    {
        return $this->belongsTo(GestionnaireFond::class, 'gestionnaire_id');
    }

    /**Prefinancements generé par transfert  d'un autre prefinancement*/
    function prefinancements(): HasMany
    {
        return $this->hasMany(PreFinancement::class, 'prefinancement_id');
    }

    function prefinancement(): BelongsTo
    {
        return $this->belongsTo(PreFinancement::class, 'prefinancement_id');
    }

    /**Financements */
    function financements(): HasMany
    {
        return $this->hasMany(Financement::class, 'prefinancement_id');
    }

    /**Handle document */
    public function handleDocumentUploading()
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

    /**Createur */
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
        static::creating(function ($financement) {
            $financement->campagne_id = Session::get("campagne")?->id;

            if (auth()->check()) {
                $financement->user_id = auth()->id();
            }

            $financement->reference = "PREFINAN-" . time() . "-CE";
            /**insertion du document */
            $financement->document = $financement->handleDocumentUploading();
        });
    }
}
