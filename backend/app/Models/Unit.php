<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $primaryKey = 'id';

    protected $fillable = [
        'id', 'unit_name','created_by', 'updated_by'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    protected static function booted(){
        parent::boot();
        static::deleting(function($unit){
            if($unit->products()->exists()){
             throw new \Exception('This units cannot be deleted because it is a part of product.');
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
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}