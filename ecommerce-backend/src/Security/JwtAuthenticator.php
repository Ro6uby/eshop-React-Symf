<?php

// src/Security/JwtAuthenticator.php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Jose\Component\Core\JWK;
use Jose\Component\Signature\JWSVerifier;
use Jose\Component\Signature\Serializer\CompactSerializer;

class JwtAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        private JWK $jwk,
        private JWSVerifier $jwsVerifier
    ) {}

    public function supports(Request $request): ?bool
    {
        return $request->headers->has('Authorization');
    }

    public function authenticate(Request $request): Passport
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            throw new AuthenticationException('No Bearer token');
        }

        $token = substr($authHeader, 7);

        $serializer = new CompactSerializer();
        $jws = $serializer->unserialize($token);

        if (!$this->jwsVerifier->verifyWithKey($jws, $this->jwk, 0)) {
            throw new AuthenticationException('Invalid JWT');
        }

        $payload = json_decode($jws->getPayload(), true);
        $username = $payload['username'] ?? null;

        if (!$username) {
            throw new AuthenticationException('Invalid payload');
        }

        return new SelfValidatingPassport(new UserBadge($username));
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?JsonResponse
    {
        return new JsonResponse(['error' => $exception->getMessageKey()], 401);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?JsonResponse
    {
        return null; // allow request to continue
    }
}
