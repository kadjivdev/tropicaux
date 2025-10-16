<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
// use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Getting all roles
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->school) {
            $roles = Role::with(['permissions', 'users'])
                ->where('id', '!=', 1)
                ->where('school_id', $user->school_id)
                // ->whereNotIn('id', $user->roles->pluck('id')->toArray())
                ->latest()
                ->get();
        } else {
            $roles = Role::with(['permissions', 'users'])
                ->where('id', '!=', 1)
                ->latest()->get();
        }

        return Inertia::render('Role/List', [
            "roles" => $roles,
        ]);
    }

    /**
     * Getting all permissions
     */
    public function getPermissions(Request $request, $id)
    {
        $role = Role::with(["permissions", "school"])->find($id);

        return Inertia::render('Role/Permissions', [
            "role" => $role,
            "permissions" => Permission::all(),
        ]);
    }

    /**
     * Getting all users
     */
    public function getUsers(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->school) {
            $role = Role::with([
                "users" => function ($query) use ($user) {
                    $query->where("school_id", $user->school_id);
                },
                "users.detail",
                "users.school"
            ])
                ->find($id);
        } else {
            $role = Role::with(["users.detail", "users.school"])->find($id);
        }

        return Inertia::render('Role/Users', [
            "role" => $role,
        ]);
    }

    /**
     * Create roles
     */
    public function create()
    {
        $permissions = Permission::latest()->get();

        return Inertia::render('Role/Create', [
            "permissions" => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'required|array'
        ]);

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web'
        ]);

        $role->syncPermissions($request->permissions);

        return response()->json([
            'success' => true,
            'message' => 'Rôle créé avec succès'
        ]);
    }

    /**
     * Actualisation 
     * des permissions d'un rôle
     */
    public function affectRole(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|integer|exists:users,id',
                'role_id' => 'required|integer|exists:roles,id',
            ], [
                'user_id.required' => 'L’utilisateur est obligatoire.',
                'user_id.integer'  => 'L’identifiant de l’utilisateur doit être un nombre entier.',
                'user_id.exists'   => 'L’utilisateur sélectionné n’existe pas dans le système.',

                'role_id.required' => 'Le rôle est obligatoire.',
                'role_id.integer'  => 'L’identifiant du rôle doit être un nombre entier.',
                'role_id.exists'   => 'Le rôle sélectionné n’existe pas dans le système.',
            ]);

            $role = Role::find($validated["role_id"]);
            $user = User::find($validated["user_id"]);

            if (!$role) {
                throw new \Exception("Ce rôle n'existe pas!");
            }

            if (!$user) {
                throw new \Exception("Ce utilisateur n'existe pas!");
            }

            DB::beginTransaction();

            /**
             *  On supprime tous les anciens liens et on garde seulement ceux envoyés
             * */
            DB::table('model_has_roles')
                ->where('model_id', $user->id)
                // ->orWhere('role_id', $role->id)
                ->delete();

            /**
             * Affcetation
             */
            $user->assignRole($role->name);

            DB::commit();
            return Redirect::back();
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation", ["errors" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure de d'exception", ["exception" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Actualisation 
     * des permissions d'un rôle
     */
    public function updatePermissions(Request $request, $id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                throw new \Exception("Ce rôle n'existe pas!");
            }
            DB::beginTransaction();

            /**
             * Permissions
             */
            $permissions = collect($request->permissions);
            if ($permissions->isEmpty()) {
                throw new Exception("Choississez au moins une permission");
            }

            $request->validate([
                'name' => 'required',
                'permissions' => 'required|array'
            ], [
                'name.required' => 'Le nom du rôle est obligatoire.',
                // 'name.unique' => 'Ce nom de rôle existe déjà, veuillez en choisir un autre.',
                'permissions.required' => 'Vous devez sélectionner au moins une permission.',
                'permissions.array' => 'Le format des permissions est invalide.',
            ]);

            /**
             * Update role name
             */
            $role->update(["name" => $request->name]);

            /**
             * Synchronisation des permissions
             */
            $role->syncPermissions($permissions->pluck("name"));

            DB::commit();
            return Redirect::route("role.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation", ["errors" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure de d'exception", ["exception" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Actualisation 
     * des users d'un rôle
     */
    public function updateUsers(Request $request, $id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                throw new \Exception("Ce rôle n'existe pas!");
            }

            DB::beginTransaction();

            /**
             * Users
             */
            $users = collect($request->users);

            if ($users->isEmpty()) {
                throw new Exception("Choississez au moins un utilisateur");
            }

            $request->validate([
                'users' => 'required|array'
            ]);

            /**
             * Synchronisation des users
             */
            User::whereIn('id', $users->pluck('id')->toArray())
                ->get()
                ->each(function ($user) use ($role) {
                    // On supprime tous les anciens liens et on garde seulement ceux envoyés
                    DB::table('model_has_roles')
                        ->where('model_id', $user->id)
                        ->orWhere('role_id', $role->id)
                        ->delete();

                    $user->assignRole($role->name);
                });

            DB::commit();
            return Redirect::route("role.index");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation", ["errors" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure de d'exception", ["exception" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        if ($role->name === 'super-admin') {
            return response()->json([
                'success' => false,
                'message' => 'Le rôle super-admin ne peut pas être supprimé'
            ], 403);
        }

        if ($role->users()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Ce rôle est attribué à des utilisateurs'
            ], 403);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rôle supprimé avec succès'
        ]);
    }
}
