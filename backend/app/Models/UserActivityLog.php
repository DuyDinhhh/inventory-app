<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'action',
        'details',
        'loggable_id',
        'loggable_type',
    ];

    /**
     * Compare old and new values for each attribute and return the changes.
     *
     * @param array $oldValues
     * @param array $newValues
     * @return array
     */
    // public static function logChanges(array $oldValues, array $newValues)
    // {
    //     $changes = [];

    //     // Compare old and new values for each attribute and record the changes
    //     foreach ($oldValues as $key => $oldValue) {
    //         if ($key === 'updated_at'||$key === 'updated_by') {
    //             continue;
    //         }
    //         if (array_key_exists($key, $newValues) && $oldValue != $newValues[$key]) {
    //             $changes[$key] = [
    //                 'old' => $oldValue,
    //                 'new' => $newValues[$key],
    //             ];
    //         }
    //     }

    //     return $changes;
    // }
    public static function logChanges(array $oldValues, array $newValues)
{
    $changes = [];

    foreach ($oldValues as $key => $oldValue) {
        if ($key === 'updated_at' || $key === 'updated_by') {
            continue;
        }

        $newValue = $newValues[$key] ?? null;

        // Convert enums to their scalar value for comparison
        if ($oldValue instanceof \BackedEnum) {
            $oldValue = $oldValue->value;
        }
        if ($newValue instanceof \BackedEnum) {
            $newValue = $newValue->value;
        }

        if ((string)$oldValue !== (string)$newValue) {
            $changes[$key] = [
                'old' => $oldValue,
                'new' => $newValue,
            ];
        }
    }

    return $changes;
}
    /**
     * Polymorphic relationship to the related model (e.g., Category, Product)
     */
    public function loggable()
    {
        return $this->morphTo();
    }

    /**
     * Relation to the User model
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
