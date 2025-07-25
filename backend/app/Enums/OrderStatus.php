<?php

namespace App\Enums;

enum OrderStatus: int
{
    case PENDING = 0;
    case COMPLETE = 1;
    case CANCEL = 2;
    case RETURN = 3;  

    public function label(): string
    {
        return match ($this) {
            self::PENDING => __('Pending'),
            self::COMPLETE => __('Complete'),
            self::CANCEL => __('Cancel'),
            self::RETURNED => __('Return'), 
        };
    }
}

