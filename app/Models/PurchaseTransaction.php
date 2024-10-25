<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'contact_id',
        'transaction_date',
        'amount',
        'payment_method',
        'purchase_id',
        'transaction_type',
        'note',
    ];
}
