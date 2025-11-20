<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class Financement extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "reference",
        'fournisseur_id',
        'prefinancement_id',
        'montant',
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
        'validated_at' => 'date'
    ];

    function montant_r()
    {
        return (float) $this->montant - $this->backFinancements
            // ->whereNotNull("validated_by")
            ->sum("montant");
    }

    /**Fournisseur */
    function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class, 'fournisseur_id');
    }

    /**Pre Financement */
    function preFinancement(): BelongsTo
    {
        return $this->belongsTo(PreFinancement::class, 'prefinancement_id');
    }

    /**Retours de financements */
    function backFinancements(): HasMany
    {
        return $this->hasMany(FinancementBack::class, 'financement_id');
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

            $financement->reference = "FINAN-" . time() . "-CE";
            /**insertion du document */
            $financement->document = $financement->handleDocumentUploading();
        });
    }
}
