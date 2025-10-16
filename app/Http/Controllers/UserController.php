<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Index
     */
    function index()
    {
        $users = User::with("roles")->get();
        $roles = Role::where('id', '!=', 1)
            ->latest()->get();

        return Inertia::render('User/List', [
            'users' => UserResource::collection($users),
            'roles' => $roles,
        ]);
    }

    /**
     * Create
     */
    function create(Request $request)
    {
        return Inertia::render('User/Create', [
            'roles' => Role::where("id", "!=", 1)->get(),
        ]);
    }

    /**
     * Store
     */
    function store(Request $request)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                'firstname'   => 'required|string',
                'lastname'    => 'required|string',
                'role_id'   => 'required|integer',

                'email'       => 'required|string|lowercase|email|max:255|unique:users,email',
                'password'    => ['required', 'confirmed', Rules\Password::defaults()],

                'phone'       => 'nullable|string',
                'profile_img' => 'nullable|image|mimes:png,jpeg',
            ], [
                // 🔹 Messages personnalisés
                'firstname.required'   => 'Le prénom est obligatoire.',
                'firstname.string'     => 'Le prénom doit être une chaîne de caractères.',

                'lastname.required'    => 'Le nom est obligatoire.',
                'lastname.string'      => 'Le nom doit être une chaîne de caractères.',

                'role_id.required'   => "Le rôle est obligatoire.",
                'role_id.integer'    => "Le rôle doit être un nombre.",

                'email.required'       => "L'adresse email est obligatoire.",
                'email.string'         => "L'adresse email doit être une chaîne de caractères.",
                'email.lowercase'      => "L'adresse email doit être en minuscules.",
                'email.email'          => "L'adresse email n'est pas valide.",
                'email.max'            => "L'adresse email ne doit pas dépasser 255 caractères.",
                'email.unique'         => "Cette adresse email est déjà utilisée.",

                'password.required'    => "Le mot de passe est obligatoire.",
                'password.confirmed'   => "La confirmation du mot de passe ne correspond pas.",
                'password.min'         => "Le mot de passe doit contenir au moins 8 caractères.",

                // 'phone.required'       => "Le numéro de téléphone est obligatoire.",
                'phone.string'         => "Le numéro de téléphone doit être une chaîne de caractères.",

                'profile_img.image'    => "Le fichier doit être une image.",
                'profile_img.mimes'    => "L'image doit être au format PNG ou JPEG.",
            ]);

            DB::beginTransaction();

            $user = User::create([
                'firstname' => $validated["firstname"],
                'lastname' => $validated["lastname"],
                'email' => $validated["email"],
                'password' => Hash::make($validated["password"]),
            ]);

            $user->detail()->create(["phone" => $validated["phone"] ?? null]);


            /**
             * Affectation de role
             */
            $role = Role::find($validated["role_id"]);
            if (!$role) {
                throw new \Exception("Ce rôle n'existe pas");
            }

            /**
             *  On supprime tous les anciens liens et on garde seulement ceux envoyés
             * */
            DB::table('model_has_roles')
                ->where('model_id', $user->id)
                ->delete();

            /**
             * Affectation
             */
            $user->assignRole($role);

            event(new Registered($user));

            DB::commit();
            return redirect()->route("user.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création de l'école", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de création de l'école", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Edit
     */
    function edit(User $user)
    {
        $user->load("detail", "roles");

        return Inertia::render('User/Update', [
            'user' => $user,
            'rolesIds' => $user->roles->pluck('id'),
            'roles' => Role::where("id", "!=", 1)->get(),
        ]);
    }

    /**
     * Update
     */
    function update(Request $request, User $user)
    {
        Log::info("Les datas", ["data" => $request->all()]);

        try {
            $validated = $request->validate([
                'firstname'   => 'required|string',
                'lastname'    => 'required|string',
                'role_id'   => 'required|integer',

                'email'       => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,

                'phone'       => 'nullable|string',
                //  'profile_img' => 'nullable|image|mimes:png,jpg,jpeg|max:2048', // ← Correction ici
            ], [
                // 🔹 Messages personnalisés
                'firstname.required'   => 'Le prénom est obligatoire.',
                'firstname.string'     => 'Le prénom doit être une chaîne de caractères.',

                'lastname.required'    => 'Le nom est obligatoire.',
                'lastname.string'      => 'Le nom doit être une chaîne de caractères.',

                'role_id.required'   => "Le rôle est obligatoire.",
                'role_id.integer'    => "Le rôle doit être un nombre.",

                'email.required'       => "L'adresse email est obligatoire.",
                'email.string'         => "L'adresse email doit être une chaîne de caractères.",
                'email.lowercase'      => "L'adresse email doit être en minuscules.",
                'email.email'          => "L'adresse email n'est pas valide.",
                'email.max'            => "L'adresse email ne doit pas dépasser 255 caractères.",
                'email.unique'         => "Cette adresse email est déjà utilisée.",

                'phone.string'         => "Le numéro de téléphone doit être une chaîne de caractères.",

                // 'profile_img.image'    => "Le fichier doit être une image.",
                //  'profile_img.mimes'    => "L'image doit être au format PNG, JPG ou JPEG.", // ← Message corrigé
            ]);

            DB::beginTransaction();

            $user->update([
                'firstname' => $validated["firstname"],
                'lastname' => $validated["lastname"],
                'email' => $validated["email"],
            ]);

            $user->detail()->update(["phone" => $validated["phone"] ?? null]);

            /**
             * Affectation de role
             */
            $role = Role::find($validated["role_id"]);
            if (!$role) {
                throw new \Exception("Ce rôle n'existe pas");
            }

            /**
             *  On supprime tous les anciens liens et on garde seulement ceux envoyés
             * */
            DB::table('model_has_roles')
                ->where('model_id', $user->id)
                ->delete();

            /**
             * Affectation
             */
            $user->assignRole($role);

            event(new Registered($user));

            DB::commit();
            return redirect()->route("user.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de l'utilisateur", ["error" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::debug("Erreure lors de la modification de l'utilisateur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Destroy
     */
    function destroy(User $user)
    {
        try {
            $user->delete();
            return redirect()->route("user.index");
        } catch (\Exception $e) {
            Log::debug("Erreure lors de la suppression de l'utilisateur", ["error" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }
}
