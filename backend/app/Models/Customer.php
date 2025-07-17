<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $primaryKey = 'id';

    protected $fillable = [
        'id', 'name', 'email', 'phone', 'address', 'type',
        'bank_name', 'account_holder', 'account_number', 'photo','created_by', 'updated_by'
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id', 'id');
    }


    protected static function booted()
    {
        parent::boot();
        static::deleting(function ($customer){
            if($customer->orders()->exists()){
                throw new \Exception('This customer cannot be deleted cuz it is a part of an order.');
            }
        });
    }
    public function quotations(): HasMany
    {
        return $this->HasMany(Quotation::class);
    }
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}