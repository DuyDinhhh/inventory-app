<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Order extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';

    protected $fillable = [
        'id', 'customer_id', 'order_date', 'order_status', 'total_products',
        'sub_total', 'var', 'total', 'invoice_no', 'payment_type', 'pay', 'due','created_by', 'updated_by'
    ];
    protected $casts = [
        'order_date'    => 'date',
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
        'order_status'  => OrderStatus::class
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    
    public function details(): HasMany
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function scopeSearch($query, $value): void
    {
        $query->where('invoice_no', 'like', "%{$value}%")
            ->orWhere('order_status', 'like', "%{$value}%")
            ->orWhere('payment_type', 'like', "%{$value}%");
    }
}