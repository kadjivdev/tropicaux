<?php

namespace Database\Seeders;

use App\Models\DepenseGeneraleType;
use App\Models\TypeFinancement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeFinancementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ["libelle" => "Achat de Ciment", "description" => "Les financements ou préfinancement pour achat de ciment"],
            ["libelle" => "Achat à la quincaillérie", "description" => "Les financements ou préfinancement pour achat à la quincaillérie"],
            ["libelle" => "Autres dépenses", "description" => "Les financements ou préfinancement pour achat d'autres choses"],
        ];

        DB::table('type_financements')->delete();

        // insertions
        TypeFinancement::insert($types);
    }
}
