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
        Schema::create('ventes', function (Blueprint $table) {
            $table->id();
            $table->foreignId("partenaire_id")
                ->nullable()
                ->constrained("partenaires")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");

            $table->foreignId("user_id")
                ->nullable()
                ->constrained("users")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");

            $table->decimal('prix')->nullable();
            $table->decimal('montant')->nullable();
            $table->decimal('poids')->nullable();
            $table->decimal('nbre_sac_rejete')->nullable();
            $table->decimal('prix_unitaire_sac_rejete')->nullable();
            $table->decimal('montant_total')->nullable();
            $table->text('document')->nullable();
            $table->text('commentaire')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventes');
    }
};
