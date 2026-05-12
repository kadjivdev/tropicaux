<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vente_camions', function (Blueprint $table) {
            $table->decimal('weight_rejet', 8, 2)
                ->nullable()
                ->comment("Le poids de sac rejeté")
                ->after('camion_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vente_camions', function (Blueprint $table) {
            $table->dropColumn("weight_rejet");
        });
    }
};
