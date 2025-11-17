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
        Schema::create('depense_superviseurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campagne_id')
                ->nullable()
                ->constrained('campagnes')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->text("reference")->nullable();
            $table->foreignId("chargement_id")
                ->nullable()
                ->constrained("chargements")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->foreignId("superviseur_id")
                ->nullable()
                ->constrained("superviseurs")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->foreignId("user_id")
                ->nullable()
                ->constrained("users")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->foreignId('validated_by')
                ->nullable()
                ->constrained('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->date("validated_at")->nullable();
            $table->decimal("montant", 20, 2)->nullable();
            $table->text("document")->nullable();
            $table->text("commentaire")->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depense_superviseurs');
    }
};
