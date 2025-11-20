<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Session;

class FinancementBack extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "reference",
        'financement_id',
        'montant',
        'document',
        'user_id',
        'validated_by',
        'validated_at',
        "campagne_id"
    ];

    /**Cast */
    protected $casts = [
        'montant' => 'decimal:2',
        'validated_at' => 'date'
    ];

    /**Financement */
    function financement(): BelongsTo
    {
        return $this->belongsTo(Financement::class, 'financement_id');
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
        static::creating(function ($model) {
            $model->campagne_id = Session::get("campagne")?->id;

            if (auth()->check()) {
                $model->user_id = auth()->id();
            }

            $model->reference = "FINAN-" . time() . "-BACK";
            /**insertion du document */
            $model->document = $model->handleDocumentUploading();
        });
    }
}
