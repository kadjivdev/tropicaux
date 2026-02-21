<?php

namespace Database\Seeders;

use App\Models\DepenseGeneraleType;
use Illuminate\Database\Seeder;

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
        ];

        // insertions
        DepenseGeneraleType::insert($types);
    }
}
