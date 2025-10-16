<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ], [
                // 🔑 Token
                'token.required' => 'Le jeton est obligatoire.',

                // 📧 Email
                'email.required' => 'L’adresse e-mail est obligatoire.',
                'email.email' => 'L’adresse e-mail doit être une adresse valide.',

                // 🔒 Password
                'password.required' => 'Le mot de passe est obligatoire.',
                'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
                'password.min' => 'Le mot de passe doit contenir au moins :min caractères.',
                'password.letters' => 'Le mot de passe doit contenir au moins une lettre.',
                'password.mixed' => 'Le mot de passe doit contenir au moins une lettre majuscule et une lettre minuscule.',
                'password.numbers' => 'Le mot de passe doit contenir au moins un chiffre.',
                'password.symbols' => 'Le mot de passe doit contenir au moins un symbole.',
                'password.uncompromised' => 'Ce mot de passe a été trouvé dans une fuite de données. Veuillez en choisir un autre.',
            ]);

            // Here we will attempt to reset the user's password. If it is successful we
            // will update the password on an actual user model and persist it to the
            // database. Otherwise we will parse the error and return the response.
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user) use ($request) {
                    $user->forceFill([
                        'password' => Hash::make($request->password),
                        'remember_token' => Str::random(60),
                    ])->save();

                    event(new PasswordReset($user));
                }
            );

            // If the password was successfully reset, we will redirect the user back to
            // the application's home authenticated view. If there is an error we can
            // redirect them back to where they came from with their error message.
            if ($status == Password::PASSWORD_RESET) {
                DB::commit();
                return redirect()->route('login')->with('status', __($status));
            }

            DB::rollBack();

            throw ValidationException::withMessages([
                'email' => [trans($status)],
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // dd("validation....");
            DB::rollBack();
            Log::debug("Erreure de validation", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            dd("Exception");
            DB::rollBack();
            Log::debug("Erreure lors de l'opération " . $e->getMessage());
            return back()->with(["exception" => $e->getMessage()]);
        }
    }
}
