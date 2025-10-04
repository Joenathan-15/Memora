<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Midtrans\Config;
use Midtrans\Snap;
use Exception;

class PaymentService
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key', '');
        Config::$clientKey = config('midtrans.client_key', '');
        Config::$isProduction = config('midtrans.isProduction', false);
        Config::$isSanitized = config('midtrans.isSanitized', true);
        Config::$is3ds = config('midtrans.is3ds', true);
    }

    /**
     * Create Midtrans payment and return redirect URL
     */
    public function createPayment(Product $product): string
    {
        $user = Auth::user();

        if (!$user) {
            abort(401, 'User must be logged in to create a payment.');
        }

        $orderId = 'ORDER-' . strtoupper(uniqid());
        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) $product->price,
            ],
            'customer_details' => [
                'first_name' => $user->name ?? 'Guest',
                'email' => $user->email ?? 'guest@example.com',
            ],
            'item_details' => [
                [
                    'id' => $product->id,
                    'price' => (int) $product->price,
                    'quantity' => 1,
                    'name' => $product->name,
                ],
            ],
        ];

        try {
            $transaction = Snap::createTransaction($params);
            return $transaction->redirect_url;
        } catch (Exception $e) {
            report($e); // optional: logs the error
            abort(500, 'Payment gateway error: ' . $e->getMessage());
        }
    }
}
