<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluation_forms', function (Blueprint $table) {
            $table->id();
            $table->timestamp('form_timestamp');
            $table->string('family_name');
            $table->string('first_name');
            $table->string('program');
            $table->string('contact_number');
            $table->string('email_address');
            $table->string('id_number');
            $table->boolean('evaluated')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluation_forms');
    }
};
