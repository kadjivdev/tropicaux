<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class CustomNotification extends Model
{
    /** @use HasFactory<\Database\Factories\NotificationFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'custum_notifications'; // 🔑 important !
    /**
     * fillbale
     */
    protected $fillable = [
        "sender_id",
        "receiver_id",

        "created_by",
        "updated_by",

        "message",
        "is_read",
    ];

    /**
     * Casts
     */
    protected $casts = [
        "sender_id"      => "integer",
        "receiver_id"      => "integer",

        "created_by"     => "integer",
        "updated_by"     => "integer",

        "message" => "string",
        "is_read" => "boolean"
    ];

    /**
     * Sender
     */

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, "sender_id");
    }

    /**
     * Receiver
     */

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, "receiver_id");
    }

    /**
     * Created By
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, "created_by");
    }

    /**
     * Updated By
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, "updated_by");
    }

    /**
     * Boot
     */

    static protected function boot()
    {
        parent::boot();

        // creating
        static::creating(function ($model) {
            $model->update(["created_by" => Auth::id()]);
        });

        // updating
        static::updating(function ($model) {
            $model->update(["updated_by" => Auth::id()]);
        });
    }
}
