<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Setting;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function getSales($filters){

        $query = Sale::query();
        $query->select(
            'sales.id',
            'contact_id',            // Customer ID
            'sale_date',              // Sale date
            'total_amount',           // Total amount (Total amount after discount [net_total - discount])
            'discount',                // Discount
            'amount_received',         // Amount received
            'profit_amount',          // Profit amount
            'status',
            'payment_status',
            'contacts.name',
            'contacts.balance',
            'store_id',
            'invoice_number',
            'sale_type'
        )
        ->leftJoin('contacts', 'sales.contact_id', '=', 'contacts.id')
        ->orderBy('sales.id', 'desc');

        if(isset($filters['contact_id'])){
            $query->where('contact_id', $filters['contact_id']);
        }

        if(isset($filters['status']) && $filters['status'] !== 'all'){
            $query->where('status', $filters['status']);
        }

        // if (!isset($filters['start_date']) || !isset($filters['end_date'])) {
        //     $today = now()->format('Y-m-d'); // Format current date to 'Y-m-d'
        //     // dd($today);
        //     $filters['start_date'] = $filters['start_date'] ?? $today;
        //     $filters['end_date'] = $filters['end_date'] ?? $today;
        // }

        if(($filters['status'] ?? null) !== 'pending' && isset($filters['start_date']) && isset($filters['end_date'])){
            $query->whereBetween('sale_date', [$filters['start_date'], $filters['end_date']]);
        }

        if(isset($filters['query'])){
            $query->where('invoice_number', 'LIKE', '%' . $filters['query'] . '%');
        }

        $perPage = $filters['per_page'] ?? 100;
        $results = $query->paginate($perPage);
        $results->appends($filters);
        return $results;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['contact_id', 'start_date', 'end_date', 'status', 'query', 'per_page']);
        $sales = $this->getSales($filters);
        $contacts = Contact::select('id', 'name','balance')->customers()->get();

        return Inertia::render('Sale/Sale', [
            'sales' => $sales,
            'contacts'=>$contacts,
            'pageLabel'=>'Sales',
        ]);
    }

    public function reciept($id){
        $imageUrl='';
        if (app()->environment('production')) $imageUrl='public/';

        $settings = Setting::all();
        $settingArray = $settings->pluck('meta_value', 'meta_key')->all();
        $settingArray['shop_logo'] = $imageUrl.$settingArray['shop_logo'];
        $sale = Sale::select(
            'sales.id',
            'contact_id',            // Customer ID
            'sale_date',              // Sale date
            'total_amount',           // Total amount (Total amount after discount [net_total - discount])
            'discount',                // Discount
            'amount_received',         // Amount received
            'profit_amount',          // Profit amount
            'status',                  // Sale status
            'stores.address',
            'contacts.name', // Customer name from contacts
            'sales.created_by',
            'invoice_number',
            'stores.sale_prefix',
            'stores.contact_number',
            'sales.created_at'
        )
        ->leftJoin('contacts', 'sales.contact_id', '=', 'contacts.id') // Join with contacts table using customer_id
        ->join('stores', 'sales.store_id','=','stores.id')
        ->where('sales.id',$id)
        ->first();

        $user = User::find($sale->created_by);

        $salesItems = SaleItem::select(
            'sale_items.quantity',
            'sale_items.unit_price',
            'sale_items.discount',
            'products.name',
            DB::raw("CASE 
                WHEN products.product_type = 'reload' 
                THEN reload_and_bill_metas.account_number 
                ELSE NULL 
             END as account_number")
        )
        ->leftJoin('products', 'sale_items.product_id', '=', 'products.id') // Join with contacts table using customer_id
        ->leftJoin('reload_and_bill_metas', function ($join) {
            $join->on('sale_items.id', '=', 'reload_and_bill_metas.sale_item_id')
                 ->where('products.product_type', '=', 'reload');
        })
        ->where('sale_items.sale_id',$id)
        ->get();
        
        return Inertia::render('Sale/Reciept',[
            'sale'=>$sale,
            'salesItems'=>$salesItems,
            'settings'=>$settingArray,
            'user_name'=>$user->name,
        ]);
    }

    public function getSoldItems($filters){
        $query = SaleItem::query();
        $query->select(
            'sale_items.id',
            'sale_items.sale_id',
            'sale_items.product_id',
            'sale_items.quantity',
            'sale_items.unit_price',
            'sale_items.unit_cost',
            'sale_items.discount',
            'products.name as product_name',
            'sales.sale_date',
            'contacts.name as contact_name',
            'contacts.balance',
        )
        ->join('products', 'sale_items.product_id', '=', 'products.id')
        ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
        ->join('contacts', 'sales.contact_id', '=', 'contacts.id')
        ->orderBy('sales.id', 'desc');

        if(isset($filters['contact_id'])){
            $query->where('sales.contact_id', $filters['contact_id']);
        }

        if(isset($filters['start_date']) && isset($filters['end_date'])){
            $query->whereBetween('sales.sale_date', [$filters['start_date'], $filters['end_date']]);
        }
        $perPage = $filters['per_page'] ?? 100;
        $results = $query->paginate($perPage);
        $results->appends($filters);
        return $results;
    }

    public function solditems(Request $request){
        $filters = $request->only(['contact_id', 'start_date', 'end_date', 'per_page']);
        $soldItems = $this->getSoldItems($filters);
        $contacts = Contact::select('id', 'name','balance')->customers()->get();
        return Inertia::render('SoldItem/SoldItem',[
            'sold_items'=>$soldItems,
            'contacts'=>$contacts,
            'pageLabel'=>'Sold Items',
        ]);
    }
}
