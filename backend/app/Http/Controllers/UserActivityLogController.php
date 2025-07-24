<?php

namespace App\Http\Controllers;
use App\Models\UserActivityLog;

use Illuminate\Http\Request;

class UserActivityLogController extends Controller
{
    public function __construct()
    {
        $this->middleware('viewlog')->only(['log','search']);
    }

    public function log(Request $request)
    {
        $log = UserActivityLog::with('user','loggable')->orderBy('created_at','desc')->paginate(8);
 
        return response()->json($log);
    }

    public function search(Request $request)
    {
        $search = $request->query('q');

        $logs = UserActivityLog::with(['user', 'loggable'])
        ->where(function ($q) use ($search) {
            $q->where('action', 'like', "%{$search}%")
              ->orWhere('details', 'like', "%{$search}%")
              ->orWhere('loggable_type', 'like', "%{$search}%")
              ->orWhereHas('user', function($userQ) use ($search) {
                  $userQ->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
              });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(8);
        return response()->json($logs);
    }
}
