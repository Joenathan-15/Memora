<?php

namespace App\Http\Controllers;

use App\Models\Product;
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

        $snapUrl = $paymentService->createPayment($product);

        // $userinfo->gems += $product->quantity;
        // $userinfo->save();

        return Inertia::location($snapUrl);
        // return redirect()->back()->with('success', 'Product purchased successfully!');
    }
}
