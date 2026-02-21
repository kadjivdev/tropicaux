<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepenseGeneraleType extends Model
{
    protected $fillable = [
        "libelle",
        "description"
    ];
}
