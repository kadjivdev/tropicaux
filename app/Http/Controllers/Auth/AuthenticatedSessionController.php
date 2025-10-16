<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $request->authenticate();
            $request->session()->regenerate();

            DB::commit();
            return redirect()->intended(route('dashboard', absolute: false));
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de Validation: ", ["error" => $e->errors()]);
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur lors de la tentative de connexion: " . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Une erreur est survenue lors de la tentative de connexion. Veuillez réessayer plus tard.'])->withInput();
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect('/login');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erreur lors de la tentative de déconnexion: " . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Une erreur est survenue lors de la tentative de déconnexion. Veuillez réessayer plus tard.']);
        }
    }
}
