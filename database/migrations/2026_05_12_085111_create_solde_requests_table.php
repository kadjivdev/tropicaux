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
        Schema::create('solde_requests', function (Blueprint $table) {
            $table->id();
            $table->string('numero')->nullable();

            $table->foreignId("campagne_id")
                ->nullable()
                ->constrained("campagnes", "id")
                ->onDelete("set null");

            $table->foreignId("fournisseur_id")
                ->nullable()
                ->constrained("fournisseurs", "id")
                ->onDelete("set null");

            $table->foreignId("created_by")
                ->nullable()
                ->constrained("users", "id")
                ->onDelete("set null");

            $table->foreignId("validated_by")
                ->nullable()
                ->constrained("users", "id")
                ->onDelete("set null");

            $table->decimal("montant", 8, 2);
            $table->text('commentaire')->nullable();
            $table->string('preuve')->nullable();
            $table->date("validated_at")->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solde_requests');
    }
};
