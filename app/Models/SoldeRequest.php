<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class SoldeRequest extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "numero",
        "montant",
        "commentaire",
        "preuve",

        "campagne_id",
        "fournisseur_id",
        "created_by",

        "validated_by",
        "validated_at"
    ];

    protected $casts = [
        "numero" => "string",
        "fournisseur_id" => "integer",
        "created_by" => "integer",
        "validated_by" => "integer",
        "montant" => "decimal:2",
        "commentaire" => "string",
        "validated_at" => "datetime"
    ];

    function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class, "fournisseur_id");
    }

    function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, "created_by");
    }

    function validatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, "validated_by");
    }

    // handle  preuve file
    function getPreuveUrl()
    {
        Log::debug("getPreuveUrl is called ...");

        $fileUrl = null;
        if (request()->hasFile("preuve")) {
            $file = request()->file("preuve");
            $name = time() . "_" . $file->getClientOriginalName();
            $file->move("preuves", $name);
            $fileUrl = asset("/preuves/" . $name);
        }

        return $fileUrl;
    }

    // boot
    protected static function boot()
    {
        parent::boot();

        // creating
        static::creating(function ($model) {
            $model->campagne_id = Session::get("campagne")?->id;

            if (Auth::user()) {
                $model->created_by = Auth::id();
            }
        });

        // created
        static::created(function ($model) {
            $model->numero = "REQ-" . time() . "-TE";
            $model->preuve = $model->getPreuveUrl();
            $model->saveQuietly();
        });

        // updating
        static::updating(function ($model) {
            Log::info("Updating .....");
            if (request()->hasFile("preuve")) {
                Log::info("Preuve existe .....");
                $model->preuve = $model->getPreuveUrl();
                $model->saveQuietly(); // VERY IMPORTANT
            }
        });
    }
}
