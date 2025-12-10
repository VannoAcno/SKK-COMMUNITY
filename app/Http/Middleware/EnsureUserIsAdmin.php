<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        // Cek apakah user login dan is_admin = true
        if (!Auth::check() || !Auth::user()->is_admin) {
            return redirect('/home'); // atau abort(403)
        }

        return $next($request);
    }
}