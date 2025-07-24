import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button size="lg" asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow-card">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={`/img/${item.image}`}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg leading-tight">
                            {item.name}
                          </h3>
                          <Badge variant="secondary" className="mt-1">
                            {item.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-ecommerce-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24 shadow-product">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-ecommerce-price">
                    ${(getTotalPrice() * 1.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {isAuthenticated ? (
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="w-full" asChild>
                      <Link to="/login?redirect=cart">Login to Checkout</Link>
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      New customer?{' '}
                      <Link to="/register" className="text-primary hover:underline">
                        Create an account
                      </Link>
                    </p>
                  </>
                )}
                
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>

              <div className="mt-6 text-xs text-muted-foreground">
                <p>• Free shipping on orders over $50</p>
                <p>• 30-day return policy</p>
                <p>• Secure checkout with SSL</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;