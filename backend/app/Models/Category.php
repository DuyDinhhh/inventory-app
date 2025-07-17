<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = 'id';

    protected $fillable = [
          'category_name','created_by', 'updated_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
    }
 
 
    protected static function booted(){
        parent::boot();
        static::deleting(function($category){
            if($category->products()->exists()){
                throw new \Exception('This category cannot be deleted because it is a part of a product');
            }
        });
    }
    // Relationships for created_by and updated_by
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Scopes
    public function scopeSearch($query, $value)
    {
        $query->where('category_name', 'like', "%{$value}%");
    }
}