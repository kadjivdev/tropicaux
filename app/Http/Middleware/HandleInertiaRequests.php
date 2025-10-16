<?php

namespace App\Http\Middleware;

use App\Models\School;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'receivedNotificationsNbr' => $request->user() ? $request->user()->notificationsReceived->count() : 0,
                'base_url' => env("APP_URL"),
                'permissions' => $request->user()?->getAllPermissions(),
            ],
        ];
    }
}
