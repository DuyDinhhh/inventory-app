<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanUserViewLog
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            if (!(auth()->check() && auth()->user()->role->role_name == "admin")) {
                // Prepare the response message
                $message = __("You don't have permission to view the user log");
                return response()->json([
                    'success' => false,
                    'message' => $message,
                ], 403);  
            }
    
            return $next($request);
        } catch (Exception $e) {
            \Log::error($e->getMessage());
            // Handle exceptions
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request.',
            ], 500);  // Return 500 Internal Server Error if exception occurs
        }
    }
}
