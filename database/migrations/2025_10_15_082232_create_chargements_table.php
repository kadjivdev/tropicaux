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
        Schema::create('chargements', function (Blueprint $table) {
            $table->id();
            $table->foreignId("produit_id")
                ->nullable()
                ->constrained("produits")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->foreignId("chauffeur_id")
                ->nullable()
                ->constrained("chauffeurs")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->foreignId("superviseur_id")
                ->nullable()
                ->constrained("superviseurs")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->foreignId("convoyeur_id")
                ->nullable()
                ->constrained("superviseurs")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->foreignId("magasin_id")
                ->nullable()
                ->constrained("magasins")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->foreignId("user_id")
                ->nullable()
                ->constrained("users")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->date("adresse")->nullable();
            $table->text("observation")->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chargements');
    }
};
