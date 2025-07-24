<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User; // adapte selon ton namespace

class LoginAuthenticator extends AbstractAuthenticator
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function supports(Request $request): bool
    {
        return $request->isMethod('POST') && $request->getPathInfo() === '/api/login';
    }

  public function authenticate(Request $request): Passport
{
    try {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            throw new CustomUserMessageAuthenticationException('Email and password must be provided.');
        }

        $entityManager = $this->entityManager;

        return new Passport(
            new UserBadge($email, function ($userIdentifier) use ($entityManager) {
                $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $userIdentifier]);

                if (!$user) {
                    throw new CustomUserMessageAuthenticationException('User not found.');
                }

                return $user;
            }),
            new PasswordCredentials($password)
        );
    } catch (\Throwable $e) {
        throw new CustomUserMessageAuthenticationException('Login Error: ' . $e->getMessage());
    }
}

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?JsonResponse
    {
        $user = $token->getUser();
          $data = [
            'message' => 'Authentication successful',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getNom(),
                'roles' => $user->getRoles(),
        ],
    ];
        return new JsonResponse(['success' => true], 200);
    }

    public function onAuthenticationFailure(Request $request, \Symfony\Component\Security\Core\Exception\AuthenticationException $exception): ?JsonResponse
    {
        return new JsonResponse(['error' => $exception->getMessageKey()], 401);
    }
}
