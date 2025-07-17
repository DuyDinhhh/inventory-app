<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class PurchaseDetail extends Model
{
    use SoftDeletes;
    use HasFactory;
    public $incrementing = false;
    protected $primaryKey = null;
    public $timestamps = true;

    protected $fillable = [
        'purchase_id', 'product_id', 'quantity', 'unitcost', 'total'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $with = ['product'];

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class, 'purchase_id', 'id');
    }
    
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}