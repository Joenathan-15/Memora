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
        Schema::create('user_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->bigInteger('gems')->default(500);
            $table->timestamp('last_reward_claimed_at')->nullable();
            $table->timestamp('reward_program_started_at')->nullable();
            $table->integer('reward_streak_count')->default(0);
            $table->enum('subscription_plan', ['free', 'super'])->default('free');
            $table->timestamp("subscription_start")->nullable();
            $table->timestamp("subscription_end")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_infos');
    }
};
