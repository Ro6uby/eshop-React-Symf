<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Product;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;


final class ProductController extends AbstractController
{
    #[Route('/product', name: 'app_product')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ProductController.php',
        ]);
    }

    // #[Route('/api/products', name: 'api_products', methods: ['GET'])]
    // public function getProducts(EntityManagerInterface $entityManager): Response
    // {
    //     $products = $entityManager->getRepository(Product::class)->findAll();
    //     return $this->json($products);
    // }

    #[Route('/api/products', name: 'api_products', methods: ['GET'])]
public function getProducts(EntityManagerInterface $entityManager): JsonResponse
{
    $products = $entityManager->getRepository(Product::class)->findAll();

    // Transforme en tableau simple
    $data = array_map(function (Product $product) {
        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'image' => $product->getImage(),
            // ajoute d’autres champs si besoin
        ];
    }, $products);

    return $this->json($data);
}
}
