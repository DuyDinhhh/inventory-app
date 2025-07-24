<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $primaryKey = 'role_id';

    // Define the relationship with User
    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }
}