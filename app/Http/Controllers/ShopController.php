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
        if ($transaction->product->type == "currency") {
            $userinfo->gems += $transaction->product->quantity;
        } elseif ($transaction->product->type == "subscription") {
            $userinfo->subscription_plan = "super";
            $userinfo->subscription_start = now();
            $userinfo->subscription_end = now()->addDays(30);
        }
        $userinfo->save();
    }

    public function paymentNotification(Request $request)
    {
        try {
            $notification = $request->all();

            $orderId = $notification['order_id'];
            $transactionStatus = $notification['transaction_status'];
            $fraudStatus = $notification['fraud_status'] ?? null;

            $transaction = Transaction::where('id', $orderId)->first();

            if (!$transaction) {
                return response()->json(['status' => 'error', 'message' => 'Transaction not found'], 404);
            }

            if ($transactionStatus == "settlement") {
                $transaction->status = 'success';
                $this->onPaymentSuccess($transaction);
            } elseif ($transactionStatus == "capture") {
                if ($fraudStatus == 'accept') {
                    $transaction->status = 'success';
                    $this->onPaymentSuccess($transaction);
                }
            } elseif ($transactionStatus == "pending") {
                $transaction->status = 'pending';
            } else {
                $transaction->status = 'fail';
            }

            $transaction->save();
            return response()->json(['status' => 'success', 'message' => 'Notification processed']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Processing failed'], 500);
        }
    }
}
