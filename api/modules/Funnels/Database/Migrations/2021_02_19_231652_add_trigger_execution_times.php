<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

final class AddTriggerExecutionTimes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('triggers', function (Blueprint $table): void {
            $table
                ->unsignedTinyInteger('max_executions')
                ->after('position')
                ->default(1);
        });

        Schema::create('trigger_user', function (Blueprint $table): void {
            $table->foreignId('trigger_id')->constrained();
            $table->unsignedBigInteger('user_id');
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
        Schema::table('triggers', function (Blueprint $table): void {
            $table->dropColumn('max_executions');
        });

        Schema::drop('trigger_user');
    }
}
