<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

final class Funnels extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('funnels', function (Blueprint $table): void {
            $table->id();
            $table->string('title', 30);
            $table->text('description')->nullable();
            $table->timestampsTz();
        });

        Schema::create('funnel_stages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('funnel_id')->constrained();
            $table->string('title', 30);
            $table->unsignedSmallInteger('position')->default(0);
            $table->text('description')->nullable();
            $table->timestampsTz();
        });

        Schema::create('funnel_stage_user', function (Blueprint $table): void {
            $table->unsignedBigInteger('user_id');
            $table->foreignId('funnel_stage_id')->constrained();
            $table->timestampTz('completed_at')->nullable();
        });

        Schema::create('triggers', function (Blueprint $table): void {
            $table->id();
            $table->jsonb('condition');
            $table->jsonb('actions');
            $table->timestampsTz();
        });

        Schema::create('funnel_stage_trigger', function (Blueprint $table): void {
            $table->foreignId('funnel_stage_id')->constrained();
            $table->foreignId('trigger_id')->constrained();
        });

        Schema::create('funnel_trigger', function (Blueprint $table): void {
            $table->foreignId('funnel_id')->constrained();
            $table->foreignId('trigger_id')->constrained();
        });

        Schema::create('tags', function (Blueprint $table): void {
            $table->id();
            $table->string('tag', 30);
            $table->morphs('taggable');
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('funnel_stage_user');
        Schema::dropIfExists('funnel_stage_trigger');
        Schema::dropIfExists('funnel_stages');
        Schema::dropIfExists('funnel_trigger');
        Schema::dropIfExists('funnels');
        Schema::dropIfExists('triggers');
        Schema::dropIfExists('tags');
    }
}
