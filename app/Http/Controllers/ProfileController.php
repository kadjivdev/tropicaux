<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();
            $request->user()->fill($request->validated());

            if ($request->user()->isDirty('email')) {
                $request->user()->email_verified_at = null;
            }

            $request->user()->save();

            DB::commit();
            return Redirect::route('profile.edit');
        } catch (\Exception $e) {
            DB::rollBack();

            // Proposition 2: Afficher l'erreur pour le debug
            Log::error('Erreur lors de la modification du profil: ' . $e->getMessage());

            Log::debug("Erreure lors de la modification du profile!");
            return Redirect::route('profile.edit')->with(["error" => $e->getMessage()]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        try {

            $request->validate([
                'password' => ['required', 'current_password'],
            ], [
                'password.required' => 'Le mot de passe est obligatoire.',
                'password.current_password' => 'Le mot de passe saisi ne correspond pas à votre mot de passe actuel.',
            ]);

            DB::beginTransaction();
            $user = $request->user();

            Auth::logout();

            $user->delete();

            $request->session()->invalidate();
            $request->session()->regenerateToken();


            DB::commit();
            return Redirect::to('/login');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation!", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure de suppression! " . $e->getMessage());
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
