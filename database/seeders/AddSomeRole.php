<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AddSomeRole extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'Insereur de fonds',
            'Validateur de fonds',
        ];

        foreach ($roles as $name) {
            Role::create(["name" => $name]);
        }
    }
}
