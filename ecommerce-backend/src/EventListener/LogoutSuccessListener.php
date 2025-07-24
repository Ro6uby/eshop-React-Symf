<?php

// src/EventListener/LogoutSuccessListener.php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Event\LogoutEvent;

class LogoutSuccessListener
{
    public function onLogoutSuccess(LogoutEvent $event): void
    {
        $event->setResponse(new JsonResponse([
            'message' => 'Déconnexion réussie'
        ]));
    }
}
