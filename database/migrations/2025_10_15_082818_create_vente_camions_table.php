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
        Schema::create('vente_camions', function (Blueprint $table) {
            $table->id();
            $table->foreignId("chargement_id")
                ->nullable()
                ->constrained("chargements")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");

            $table->foreignId("camion_id")
                ->nullable()
                ->constrained("camions")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");

            $table->foreignId("user_id")
                ->nullable()
                ->constrained("users")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");

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
        Schema::dropIfExists('vente_camions');
    }
};
