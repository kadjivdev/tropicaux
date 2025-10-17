<?php

namespace Database\Seeders;

use App\Models\PaiementMode;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModePaiementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modesPaiement = [
            ['libelle' => 'Espèces'],
            ['libelle' => 'Chèque'],
            ['libelle' => 'Virement Bancaire'],
            ['libelle' => 'Carte Bancaire'],
            ['libelle' => 'MoMo'],
            ['libelle' => 'Effet'],
            ['libelle' => 'Avoir'],
        ];

        PaiementMode::insert($modesPaiement);
    }
}
