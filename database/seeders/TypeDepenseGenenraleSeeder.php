<?php

namespace Database\Seeders;

use App\Models\DepenseGeneraleType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeDepenseGenenraleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ["libelle" => "Transport", "description" => "Les dépenses de types transport"],
            ["libelle" => "Convayage", "description" => "Les dépenses de types convoyage"],
            ["libelle" => "Rapprochement", "description" => "Les dépenses de types rapprochement"],
            ["libelle" => "Autres/Bureau", "description" => "Les dépenses Autres/Bureau"],
        ];

        DB::table('depense_generale_types')->delete();

        // insertions
        DepenseGeneraleType::insert($types);
    }
}
