<?php

namespace App\Models;
use App\Enums\SupplierType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Supplier extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $primaryKey = 'id';
    protected $fillable = [
        'id', 'name', 'email', 'phone', 'address', 'shopname', 'type',
        'bank_name', 'account_holder', 'account_number', 'photo','created_by', 'updated_by'
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'type' => SupplierType::class
    ];

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class, 'supplier_id', 'id');
    }

 
    protected static function booted(){
        parent::boot();
        static::deleting(function ($supplier){
            if($supplier->purchases()->exists()){
                throw new \Exception('This supplier cannot be deleted because it is a part of a purchases');
            }
      });
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    public function scopeSearch($query, $value): void
    {
        $query->where('name', 'like', "%{$value}%")
            ->orWhere('email', 'like', "%{$value}%")
            ->orWhere('phone', 'like', "%{$value}%")
            ->orWhere('shopname', 'like', "%{$value}%")
            ->orWhere('type', 'like', "%{$value}%");
    }
}
