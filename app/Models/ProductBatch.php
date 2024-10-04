<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',      // The ID of the product this batch belongs to
        'batch_number',    // The batch number (e.g., 'DEFAULT')
        'expiry_date',     // The expiry date of the batch
        'cost',      // The cost price of this batch
        'price',      // The sale price of this batch
    ];
}