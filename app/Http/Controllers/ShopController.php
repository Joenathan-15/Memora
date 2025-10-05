<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use App\Services\PaymentService as ServicesPaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    function index()
    {
        return Inertia::render('shop/index', [
            "products" => Product::where('isListed', true)->get()
        ]);
    }

    public function purchase(Request $request, ServicesPaymentService $paymentService)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $product = Product::find($request->input('product_id'));

        if (!$product->isListed) {
            return redirect()->back()->withErrors(['Product is not available for purchase.']);
        }

        $user = auth()->user();
        $userinfo = $user->userinfo()->first();

        if (!$userinfo) {
            return redirect()->back()->withErrors(['User info not found.']);
        }
        $paymentData = $paymentService->createPayment($product);

        Transaction::create([
            "id" => $paymentData["orderId"],
            "product_id" => $product->id,
            "user_id" => $user->id,
            "grand_total" => $product->price
        ]);
        return Inertia::location($paymentData["snapUrl"]);
    }

    private function onPaymentSuccess(Transaction $transaction)
    {
        $user = User::find($transaction->user_id);
        $userinfo = $user->UserInfo;
        $transaction = $transaction->load("product");
        $userinfo->gems += $transaction->product->quantity;
        $userinfo->save();
    }

    public function paymentNotification(Request $request)
    {
        try {
            $notification = $request->all();

            // Verify the notification
            $orderId = $notification['order_id'];
            $transactionStatus = $notification['transaction_status'];
            $fraudStatus = $notification['fraud_status'] ?? null;

            // Find the transaction in your database
            $transaction = Transaction::where('id', $orderId)->first();

            if (!$transaction) {
                return response()->json(['status' => 'error', 'message' => 'Transaction not found'], 404);
            }

            // Handle different transaction statuses
            switch ($transactionStatus) {
                case 'capture':
                    if ($fraudStatus == 'accept') {
                        $transaction->status = 'success';
                        $this->onPaymentSuccess($transaction);
                    }
                    break;

                case 'settlement':
                    $transaction->status = 'success';
                    $this->onPaymentSuccess($transaction);
                    break;

                case 'pending':
                    $transaction->status = 'pending';
                    break;

                case 'deny':
                    $transaction->status = 'fail';
                    break;

                case 'expire':
                    $transaction->status = 'fail';
                    break;

                case 'cancel':
                    $transaction->status = 'fail';
                    break;

                default:
                    break;
            }

            $transaction->save();

            return response()->json(['status' => 'success', 'message' => 'Notification processed']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Processing failed'], 500);
        }
    }
}
