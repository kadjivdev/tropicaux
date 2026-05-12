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
        Schema::table('ventes', function (Blueprint $table) {
            $table->foreignId("type_vente_id")
                ->nullable()
                ->after("chargement_id")
                ->comment("Le type de vente")
                ->constrained("type_ventes", "id")
                ->onUpdate("set null")
                ->onDelete("set null");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ventes', function (Blueprint $table) {
            $table->dropForeign(["vente_id"]);
            $table->dropColumn("vente_id");
        });
    }
};
