<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

final class CreateTriggerUserActionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('trigger_user_actions', function (Blueprint $table): void {
            $table->id();

            $table->string('type');
            $table->foreignId('trigger_id')->constrained('triggers');
            $table->integer('user_id');
            $table->unsignedTinyInteger('status')->default(0);

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::table('trigger_user', function (Blueprint $table): void {
            $table->dateTime('completed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('trigger_user_actions');

        Schema::table('trigger_user', function (Blueprint $table): void {
            $table->dropColumn('completed_at');
        });
    }
}
