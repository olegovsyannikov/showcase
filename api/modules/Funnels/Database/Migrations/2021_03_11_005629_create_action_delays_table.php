<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

final class CreateActionDelaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('action_delays', function (Blueprint $table): void {
            $table->id();
            $table->integer('user_id');
            $table->foreignId('funnel_stage_id')->constrained();
            $table->foreignId('trigger_id')->constrained();
            $table->string('key_code');
            $table->text('data');
            $table->timestampTz('should_run_at')->nullable();
            $table->timestampTz('processed_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('action_delays');
    }
}
