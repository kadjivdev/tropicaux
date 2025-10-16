<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        try {
            DB::beginTransaction();
            $validated = $request->validate([
                'current_password' => ['required', 'current_password'],
                'password' => ['required', Password::defaults(), 'confirmed'],
            ], [
                'current_password.required' => 'Le mot de passe actuel est requis.',
                'current_password.current_password' => 'Le mot de passe actuel est incorrect.',
                'password.required' => 'Le nouveau mot de passe est requis.',
                'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',

                'password' => [
                    'letters' => 'Le mot de passe doit contenir au moins une lettre.',
                    'mixed' => 'Le mot de passe doit contenir au moins une lettre majuscule et une lettre minuscule.',
                    'numbers' => 'Le mot de passe doit contenir au moins un chiffre.',
                    'symbols' => 'Le mot de passe doit contenir au moins un symbole.',
                    'uncompromised' => 'Le mot de passe donné a été trouvé dans une fuite de données. Veuillez en choisir un autre.',
                ],

                'min' => [
                    'string' => 'Le champ :attribute doit contenir au moins :min caractères.',
                ],
            ]);

            $request->user()->update([
                'password' => Hash::make($validated['password']),
            ]);

            DB::commit();
            return back();
        } catch (\Illuminate\Validation\ValidationException $e) {
            // dd("errorr");
            DB::rollBack();
            Log::debug("Erreure lors de la modification du mot de passe");
            return back()->withErrors($e->errors());
        }
    }
}
