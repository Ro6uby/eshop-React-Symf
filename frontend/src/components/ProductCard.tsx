import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product, useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-product transition-all duration-300 animate-fade-in">
      <div className="relative overflow-hidden">
        <img
          src={`/img/${product.image}`}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock Badge */}
        {!product.inStock && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-ecommerce-price">
                ${product.price.toFixed(2)}
              </div>
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="min-w-[100px]"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;