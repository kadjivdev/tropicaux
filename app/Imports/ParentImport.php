<?php

namespace App\Imports;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithSkipDuplicates;
use Maatwebsite\Excel\Row;

class ParentImport implements OnEachRow, WithSkipDuplicates
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */

    public function onRow(Row $row)
    {
        $rowIndex = $row->getIndex();   // 👉 numéro de la ligne (1, 2, 3, ...)
        $rowData  = $row->toArray();    // 👉 données de la ligne

        // Exemple : ignorer la première ligne
        if ($rowIndex === 1) {
            return;
        }

        /**
         * 
         */
        if (!isset($row[0]) || !isset($row[1]) || !isset($row[2]) || !isset($row[3])) {
            throw new \Exception("Tous les champs (nom, Prénom,email, phone) sont réquis!");
        }

        if (User::firstWhere("email", $row[2])) {
            throw new \Exception("Erreure de validation de la ligne: $rowIndex . Le mail $row[2] existe déjà!");
        }

        /**
         * Creation du user
         */
        $user = User::create([
            'firstname' => $rowData[0],
            'lastname' => $rowData[1],
            'email' => $rowData[2],
            'password' => Hash::make($rowData[0] . "@2025"),
            'school_id' => Auth::user()->school_id,
        ]);

        /**
         * Detail du user
         */
        $user->detail()
            ->create(["phone" => $row[3] ?? null]);

        $school = Auth::user()->school;

        /**
         * Affectation de role
         */
        $roleName = $school ? "Parent" . ' (' . $school->raison_sociale . ')' : 'Parent';
        $role = Role::firstWhere(["name" => $roleName]);
        if (!$role) {
            throw new \Exception("Le rôle parent n'existe pas");
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
        $user->assignRole($roleName);
    }
}
