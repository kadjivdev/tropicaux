<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeFinancement extends Model
{
    protected $fillable = [
        "libelle",
        "description"
    ];
}
