import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Product } from '@/contexts/CartContext';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/products');
      const apiProducts = response.data;

      const mappedProducts: Product[] = apiProducts.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price), // car dans la BDD c'est une chaîne
        image: item.image,
        category: 'Articles Ménagers Réutilisables',
        inStock: true,
      }));

      setProducts(mappedProducts);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, fetchProducts };
};
