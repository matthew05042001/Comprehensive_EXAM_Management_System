<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comprehensive_exam_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('exam_id');
            $table->date('exam_date');
            $table->time('exam_time');
            $table->string('venue');
            $table->string('program');
            $table->foreignId('proctor_id')->nullable()->constrained('panelists')->nullOnDelete();
            $table->string('proctor_name')->nullable();
            $table->timestamps();
            $table->index(['exam_date', 'program']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comprehensive_exam_schedules');
    }
};
