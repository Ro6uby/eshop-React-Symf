<?php

// namespace App\Controller;

// use App\Entity\User;
// use Doctrine\ORM\EntityManagerInterface;
// use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManager;
// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\HttpFoundation\JsonResponse;
// use Symfony\Component\HttpFoundation\Request;
// use Symfony\Component\HttpFoundation\Response;
// use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
// use Symfony\Component\Routing\Annotation\Route;
// use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
// use Symfony\Component\Validator\Validator\ValidatorInterface;


// class AuthController extends AbstractController
// {
//     private $passwordHasher;
//     private $JWTTokenManager;
//     private $entityManager;

//     public function __construct(
//         UserPasswordHasherInterface $passwordHasher,
//         EntityManagerInterface $entityManager,
//         ValidatorInterface $validator,
//         TokenStorageInterface $tokenStorage,
//         JWTTokenManagerInterface $jwtManager
//     ) {
//         $this->passwordHasher = $passwordHasher;
//         $this->entityManager = $entityManager;
//         $this->validator = $validator;
//         $this->tokenStorage = $tokenStorage;
//         $this->jwtManager = $jwtManager;
//     }

    
//     #[Route('/api/register', name: 'api_register', methods: ['POST'])]
//     public function register(Request $request): Response
//     {
//         $data = json_decode($request->getContent(), true);
//         $username = $data['username'] ?? null;
//         $email = $data['email'] ?? null;
//         $plainPassword = $data['password'] ?? null;

//         // Créer l'utilisateur
//         $user = new User();
//         $user->setNom($username);
//         $user->setEmail($email);
//         $user->setRoles(["ROLE_USER"]);


//         // Hacher le mot de passe avant de le stocker
//         $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
//         $user->setPassword($hashedPassword);

//         // Valider l'objet utilisateur
//         $errors = $this->validator->validate($user);

//         if (count($errors) > 0) {
//             $errorsArray = [];
//             foreach ($errors as $error) {
//                 $errorsArray[$error->getPropertyPath()] = $error->getMessage();
//             }
//             return $this->json([
//                 'status' => 'error',
//                 'errors' => $errorsArray,
//             ], Response::HTTP_BAD_REQUEST);
//         }

//         // Sauvegarder l'utilisateur
//         $this->entityManager->persist($user);
//         $this->entityManager->flush();

//         return $this->json([
//             'status' => 'success',
//             'user' => $user,
//         ], Response::HTTP_CREATED);
//     }

//     #[Route('/api/login', name: 'api_login', methods: ['POST'])]
//     public function login(Request $request): Response
//     {
//         $data = json_decode($request->getContent(), true);
//         $email = $data['email'] ?? null;
//         $password = $data['password'] ?? null;

//         if (!$email || !$password) {
//             return $this->json(['message' => 'Email ou mot de passe manquant'], Response::HTTP_BAD_REQUEST);
//         }

//         $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

//         if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
//             return $this->json(['message' => 'Email ou mot de passe incorrect'], Response::HTTP_UNAUTHORIZED);
//         }

//         // Générer le token JWT
//         $token = $this->jwtManager->create($user);

//         return $this->json([
//             'message' => 'Authentication successful',
//               // Ajouter le token dans la réponse
//             'user' => [
//                 'token' => $token,
//                 'id' => $user->getId(),
//                 'email' => $user->getEmail(),
//                 'roles' => $user->getRoles(),
//             ],
//         ]);
//     }
// }


// namespace App\Controller;

// use App\Entity\User;
// use Doctrine\ORM\EntityManagerInterface;
// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\HttpFoundation\JsonResponse;
// use Symfony\Component\HttpFoundation\Request;
// use Symfony\Component\HttpFoundation\Response;
// use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
// use Symfony\Component\Routing\Annotation\Route;
// use Symfony\Component\Validator\Validator\ValidatorInterface;
// use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

// use Jose\Component\Signature\JWSBuilder;
// use Jose\Component\Core\JWK;
// use Jose\Component\Core\AlgorithmManager;
// use Jose\Component\Signature\Algorithm\HS256;
// use Jose\Component\Signature\Serializer\CompactSerializer;
// use DateTimeImmutable;

// class AuthController extends AbstractController
// {
//     private $passwordHasher;
//     private $entityManager;
//     private $validator;
//     private $tokenStorage;
//     private $jwsBuilder;
//     private $jwk;

//     public function __construct(
//         UserPasswordHasherInterface $passwordHasher,
//         EntityManagerInterface $entityManager,
//         ValidatorInterface $validator,
//         TokenStorageInterface $tokenStorage,
//         JWSBuilder $jwsBuilder,
//         JWK $jwk
//     ) {
//         $this->passwordHasher = $passwordHasher;
//         $this->entityManager = $entityManager;
//         $this->validator = $validator;
//         $this->tokenStorage = $tokenStorage;
//         $this->jwsBuilder = $jwsBuilder;
//         $this->jwk = $jwk;
//     }

//     #[Route('/api/login', name: 'api_login', methods: ['POST'])]
//     public function login(Request $request): Response
//     {
//         $data = json_decode($request->getContent(), true);
//         $email = $data['email'] ?? null;
//         $password = $data['password'] ?? null;

//         if (!$email || !$password) {
//             return $this->json(['message' => 'Email ou mot de passe manquant'], Response::HTTP_BAD_REQUEST);
//         }

//         $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

//         if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
//             return $this->json(['message' => 'Email ou mot de passe incorrect'], Response::HTTP_UNAUTHORIZED);
//         }

//         // Construire le JWT
//         $payload = [
//             'sub' => $user->getId(),
//             'email' => $user->getEmail(),
//             'roles' => $user->getRoles(),
//             'iat' => (new DateTimeImmutable())->getTimestamp(),
//             'exp' => (new DateTimeImmutable('+1 hour'))->getTimestamp(),
//         ];

//         $serializer = new CompactSerializer();

//         $jws = $this->jwsBuilder
//             ->create()
//             ->withPayload(json_encode($payload))
//             ->addSignature($this->jwk, ['alg' => 'HS256'])
//             ->build();

//         $token = $serializer->serialize($jws, 0);

//         return $this->json([
//             'message' => 'Authentication successful',
//             'user' => [
//                 'token' => $token,
//                 'id' => $user->getId(),
//                 'email' => $user->getEmail(),
//                 'roles' => $user->getRoles(),
//             ],
//         ]);
//     }
// }




















//Je suis actuellement dans une impasse, jwt n'est pas compatible avec symfony 7.3 est ce que l'utilisation d'un token est réellement essentiel ? Apparemment je peux utiliser web-token/jwt-bundle comme alternative mais ca me semble compliquer et sinon fourni moi un tutoriel, mon Authcontroller ressemble à ca, adapte le pour utiliser web-token/jwt-bundle "<?php


// namespace App\Controller;

// use App\Entity\User;
// use Doctrine\ORM\EntityManagerInterface;
// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\HttpFoundation\Request;
// use Symfony\Component\HttpFoundation\Response;
// use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
// use Symfony\Component\Routing\Annotation\Route;
// use Symfony\Component\Validator\Validator\ValidatorInterface;
// use Jose\Component\Signature\JWSBuilder;
// use Jose\Component\Core\JWK;
// use Jose\Component\Signature\Serializer\CompactSerializer;
// use DateTimeImmutable;

// class AuthController extends AbstractController
// {
//     private UserPasswordHasherInterface $passwordHasher;
//     private EntityManagerInterface $entityManager;
//     private ValidatorInterface $validator;
//     // private JWSBuilder $jwsBuilder;
//     private JWK $jwk;

//     public function __construct(
//         UserPasswordHasherInterface $passwordHasher,
//         EntityManagerInterface $entityManager,
//         ValidatorInterface $validator,
//         JWSBuilder $jwsBuilder,
//         JWK $jwk // Injection via services.yaml (voir plus bas)
//     ) {
//         $this->passwordHasher = $passwordHasher;
//         $this->entityManager = $entityManager;
//         $this->validator = $validator;
//         $this->jwsBuilder = $jwsBuilder;
//         $this->jwk = $jwk;
//     }

//     #[Route('/api/register', name: 'api_register', methods: ['POST'])]
//     public function register(Request $request): Response
//     {
//         $data = json_decode($request->getContent(), true);
//         $username = $data['username'] ?? null;
//         $email = $data['email'] ?? null;
//         $plainPassword = $data['password'] ?? null;

//         $user = new User();
//         $user->setNom($username);
//         $user->setEmail($email);
//         $user->setRoles(['ROLE_USER']);

//         $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
//         $user->setPassword($hashedPassword);

//         $errors = $this->validator->validate($user);
//         if (count($errors) > 0) {
//             $errorsArray = [];
//             foreach ($errors as $error) {
//                 $errorsArray[$error->getPropertyPath()] = $error->getMessage();
//             }
//             return $this->json(['status' => 'error', 'errors' => $errorsArray], Response::HTTP_BAD_REQUEST);
//         }

//         $this->entityManager->persist($user);
//         $this->entityManager->flush();

//         return $this->json(['status' => 'success', 'user' => $user], Response::HTTP_CREATED);
//     }

//     #[Route('/api/login', name: 'api_login', methods: ['POST'])]
//     public function login(Request $request): Response
//     {
//         $data = json_decode($request->getContent(), true);
//         $email = $data['email'] ?? null;
//         $password = $data['password'] ?? null;

//         if (!$email || !$password) {
//             return $this->json(['message' => 'Email ou mot de passe manquant'], Response::HTTP_BAD_REQUEST);
//         }

//         $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
//         if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
//             return $this->json(['message' => 'Email ou mot de passe incorrect'], Response::HTTP_UNAUTHORIZED);
//         }

//         $payload = [
//             'sub' => $user->getId(),
//             'email' => $user->getEmail(),
//             'roles' => $user->getRoles(),
//             'iat' => (new DateTimeImmutable())->getTimestamp(),
//             'exp' => (new DateTimeImmutable('+1 hour'))->getTimestamp(),
//         ];

//         $jws = $this->jwsBuilder
//             ->create()
//             ->withPayload(json_encode($payload))
//             ->addSignature($this->jwk, ['alg' => 'HS256'])
//             ->build();

//         $serializer = new CompactSerializer();
//         $token = $serializer->serialize($jws, 0);

//         return $this->json([
//             'message' => 'Authentication successful',
//             'user' => [
//                 'token' => $token,
//                 'id' => $user->getId(),
//                 'email' => $user->getEmail(),
//                 'roles' => $user->getRoles(),
//             ],
//         ]);
//     }
// }






// // Session version of AuthController using web-token/jwt-bundle

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use App\Security\LoginAuthenticator;
use Symfony\Component\HttpFoundation\JsonResponse;


class AuthController extends AbstractController
{
    private UserPasswordHasherInterface $passwordHasher;
    private EntityManagerInterface $entityManager;
    private ValidatorInterface $validator;

    public function __construct(
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ) {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    #[Route('api/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? null;
        $email = $data['email'] ?? null;
        $plainPassword = $data['password'] ?? null;

        $user = new User();
        $user->setNom($username);
        $user->setEmail($email);
        $user->setRoles(['ROLE_USER']);

        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);

        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            $errorsArray = [];
            foreach ($errors as $error) {
                $errorsArray[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['status' => 'error', 'errors' => $errorsArray], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json(['status' => 'success', 'user' => $user], Response::HTTP_CREATED);
    }

   #[Route('/api/login', name: 'login', methods: ['POST'])]
public function login(
    Request $request,
    UserAuthenticatorInterface $userAuthenticator,
    LoginAuthenticator $authenticator
): Response {
    $data = json_decode($request->getContent(), true);
    $request->request->replace($data); // Important : injecte dans `$request->request`

    // L'authenticator se déclenche via `supports()`, donc pas besoin de logique ici
    return $this->json(['message' => 'Authenticating...']);
}

#[Route('/api/user', name: 'api_user', methods: ['GET'])]
public function user(): JsonResponse
{
    $user = $this->getUser();
    if (!$user) {
        return $this->json(['message' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
    }

    return $this->json(['user' => [
        'id' => $user->getId(),
        'email' => $user->getEmail(),
        'username' => $user->getNom(),
        'roles' => $user->getRoles(),
    ]]);
}

    // #[Route('api/logout', name: 'logout', methods: ['GET'])]
    // public function logout()
    // {
    //     setUser(null);
    //     throw new \Exception('This should never be reached');
    // }
}



// namespace App\Controller;

// use App\Entity\User;
// use Doctrine\ORM\EntityManagerInterface;
// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\HttpFoundation\Request;
// use Symfony\Component\HttpFoundation\Response;
// use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
// use Symfony\Component\Routing\Annotation\Route;
// use Symfony\Component\Validator\Validator\ValidatorInterface;
// use Jose\Component\Signature\JWSBuilder;
// use Jose\Component\Core\JWK;
// use Jose\Component\Signature\Serializer\CompactSerializer;
// use DateTimeImmutable;

// class AuthController extends AbstractController
// {
//     private UserPasswordHasherInterface $passwordHasher;
//     private EntityManagerInterface $entityManager;
//     private ValidatorInterface $validator;
//     private JWSBuilder $jwsBuilder;
//     private JWK $jwk;
//     private CompactSerializer $serializer;

//     public function __construct(
//         UserPasswordHasherInterface $passwordHasher,
//         EntityManagerInterface $entityManager,
//         ValidatorInterface $validator,
//         JWSBuilder $jwsBuilder,
//         JWK $jwk,
//         CompactSerializer $serializer
//     ) {
//         $this->passwordHasher = $passwordHasher;
//         $this->entityManager = $entityManager;
//         $this->validator = $validator;
//         $this->jwsBuilder = $jwsBuilder;
//         $this->jwk = $jwk;
//         $this->serializer = $serializer;
//     }

//     #[Route('api/register', name: 'api_register', methods: ['POST'])]
//     public function register(Request $request): Response
//     {
//         $data = json_decode($request->getContent(), true);
//         $username = $data['username'] ?? null;
//         $email = $data['email'] ?? null;
//         $plainPassword = $data['password'] ?? null;

//         $user = new User();
//         $user->setNom($username);
//         $user->setEmail($email);
//         $user->setRoles(['ROLE_USER']);

//         $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
//         $user->setPassword($hashedPassword);

//         $errors = $this->validator->validate($user);
//         if (count($errors) > 0) {
//             $errorsArray = [];
//             foreach ($errors as $error) {
//                 $errorsArray[$error->getPropertyPath()] = $error->getMessage();
//             }
//             return $this->json(['status' => 'error', 'errors' => $errorsArray], Response::HTTP_BAD_REQUEST);
//         }

//         $this->entityManager->persist($user);
//         $this->entityManager->flush();

//         return $this->json(['status' => 'success', 'user' => $user], Response::HTTP_CREATED);
//     }

//     #[Route('api/login', name: 'api_login', methods: ['POST'])]
//     public function login(Request $request): Response
//     {
//         $data = json_decode($request->getContent(), true);
//         $email = $data['email'] ?? null;
//         $password = $data['password'] ?? null;

//         $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
//         if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
//             return $this->json(['message' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
//         }

//         $payload = [
//             'sub' => $user->getId(),
//             'email' => $user->getEmail(),
//             'roles' => $user->getRoles(),
//             'iat' => (new DateTimeImmutable())->getTimestamp(),
//             'exp' => (new DateTimeImmutable('+1 hour'))->getTimestamp(),
//         ];

//         $jws = $this->jwsBuilder
//             ->create()
//             ->withPayload(json_encode($payload))
//             ->addSignature($this->jwk, ['alg' => 'HS256'])
//             ->build();

//         $token = $this->serializer->serialize($jws, 0);

//         return $this->json([
//             'message' => 'Authentication successful',
//             'token' => $token,
//             'user' => [
//                 'id' => $user->getId(),
//                 'email' => $user->getEmail(),
//                 'roles' => $user->getRoles(),
//             ],
//         ]);
//     }
// }