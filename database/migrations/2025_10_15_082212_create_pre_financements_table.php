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
        Schema::create('pre_financements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campagne_id')
                ->nullable()
                ->constrained('campagnes')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->text("reference")->nullable();
            $table->foreignId("gestionnaire_id")
                ->nullable()
                ->constrained("gestionnaire_fonds")
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
            $table->decimal("montant", 20, 2)->default(0);
            $table->decimal("reste", 20, 2)->default(0);
            $table->decimal("reste_transfere", 20, 2)->nullable();
            $table->integer("prefinancement_id")->nullable();
            $table->date("date_financement")->nullable();
            $table->text("document")->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pre_financements');
    }
};
