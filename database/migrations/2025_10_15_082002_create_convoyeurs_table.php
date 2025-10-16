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
        Schema::create('convoyeurs', function (Blueprint $table) {
            $table->id();
            $table->string('raison_sociale');
            $table->string('phone')->nullable();
            $table->text('adresse')->nullable();
            $table->text('email')->nullable();
            $table->foreignId("user_id")
                ->nullable()
                ->constrained("users")
                ->onUpdate("CASCADE")
                ->onDelete("SET NULL");
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('convoyeurs');
    }
};
