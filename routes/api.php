<?php

use App\Http\Controllers\ShopController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post("/shop/notification", [ShopController::class, "paymentNotification"]);
