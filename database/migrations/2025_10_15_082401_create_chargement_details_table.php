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
        Schema::create('chargement_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId("chargement_id")
                ->nullable()
                ->constrained("chargements")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->foreignId("fournisseur_id")
                ->nullable()
                ->constrained("fournisseurs")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->foreignId("user_id")
                ->nullable()
                ->constrained("users")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->decimal("sac_jute")->nullable();
            $table->decimal("sac_pp")->nullable();
            $table->decimal("tonnage")->nullable();
            $table->decimal("prix_achat")->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chargement_details');
    }
};
