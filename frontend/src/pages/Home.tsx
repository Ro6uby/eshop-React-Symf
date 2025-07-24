import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const Home: React.FC = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-hero py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Shop the Future of
                <span className="text-primary"> E-commerce</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover premium products with seamless shopping experience, 
                fast delivery, and unmatched customer service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="shadow-hero">
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 gradient-primary rounded-full blur-3xl opacity-20"></div>
                <img
                  src={`/img/banner.PNG`}
                  alt="Hero Product"
                  className="relative z-10 w-full h-auto rounded-2xl shadow-hero"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                description: "Free shipping on orders over $50"
              },
              {
                icon: Shield,
                title: "Secure Payment",
                description: "Your payment information is safe"
              },
              {
                icon: CreditCard,
                title: "Easy Returns",
                description: "30-day return policy"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center shadow-card hover:shadow-product transition-shadow animate-scale-in">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground">Discover our most popular items</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 gradient-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get the latest updates on new products and exclusive offers
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border bg-background"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;