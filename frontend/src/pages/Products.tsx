import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const Products: React.FC = () => {
  const { products, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading products: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <p className="text-muted-foreground">
          Discover our complete collection of premium products
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm('')}>
              Search: {searchTerm} ×
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
              Category: {selectedCategory} ×
            </Badge>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-64 mb-4"></div>
              <div className="bg-muted rounded h-4 mb-2"></div>
              <div className="bg-muted rounded h-4 w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria</p>
          <Button onClick={() => {
            setSearchTerm('');
            setSelectedCategory('all');
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;







// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Products = () => {
//     const [products, setProducts] = useState([]);
//     const [quantities, setQuantities] = useState({});
//     const navigate = useNavigate();

//     useEffect(() => {
//         axios
//             .get('http://localhost:8000/api/products') // <--- note bien l'URL complète ici
//             .then(response => setProducts(response.data))
//             .catch(error => console.error('Error fetching products:', error));

//         const userId = localStorage.getItem('id');
//         if (!userId) {
//             console.error('User ID is missing in localStorage.');
//         }
//     }, []);

//     const handleAddToCart = (productId) => {
//         const userId = localStorage.getItem('id');
//         if (!userId) {
//             console.error('User ID is missing in localStorage.');
//             return;
//         }

//         const quantity = quantities[productId] || 1;

//         axios.post('/api/cart/add', { userId, productId, quantity })
//             .then(response => {
//                 console.log('Product added to cart:', response.data);
//                 navigate('/cart');
//             })
//             .catch(error => console.error('Error adding product to cart:', error));
//     };

//     const handleQuantityChange = (productId, value) => {
//         const quantity = parseInt(value, 10);
//         if (!isNaN(quantity) && quantity > 0) {
//             setQuantities(prev => ({ ...prev, [productId]: quantity }));
//         } else {
//             setQuantities(prev => ({ ...prev, [productId]: 1 }));
//         }
//     };

//     return (
//         <div className="container py-4">
//             <img
//                 src={`/img/banner.PNG`}
//                 className="card-img-top"
//                 alt={'banner'}
//                 style={{ height: '200px', objectFit: 'cover' }}
//             />
//             <br /><br />
//             <h2 className="mb-4">Nos produits</h2>
//             <div className="row">
//                 {products.map(product => (
//                     <div className="col-md-4 mb-4" key={product.id}>
//                         <div className="card h-100">
//                             <img
//                                 src={`/img/${product.image}`}
//                                 className="card-img-top"
//                                 alt={product.name}
//                                 style={{ height: '200px', objectFit: 'cover' }}
//                             />
//                             <div className="card-body">
//                                 <h5 className="card-title">{product.name}</h5>
//                                 <p className="card-text">{product.description}</p>
//                                 <p className="card-text"><strong>Prix:</strong> {product.price} €</p>

//                                 <input
//                                     type="number"
//                                     min="1"
//                                     className="form-control mb-2"
//                                     placeholder="Quantité"
//                                     value={quantities[product.id] || 1}
//                                     onChange={(e) => handleQuantityChange(product.id, e.target.value)}
//                                 />
//                                 <button
//                                     className="btn btn-primary"
//                                     onClick={() => handleAddToCart(product.id)}
//                                 >
//                                     Ajouter au panier
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Products;





// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, Filter, Grid, List } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import axios from 'axios';

// // ProductCard component
// const ProductCard = ({ product, viewMode, quantities, handleQuantityChange, handleAddToCart }) => {
//   return (
//     <div className={viewMode === 'grid' ? 'card' : 'card'} style={{ width: '100%', minHeight: '400px' }}>
//       <img
//         src={`/img/${product.image}`}
//         className="card-img-top"
//         alt={product.name}
//         style={{ height: '200px', objectFit: 'cover' }}
//       />
//       <div className="card-body d-flex flex-column">
//         <h5 className="card-title font-bold">{product.name}</h5>
//         <p className="card-text flex-grow-1">{product.description}</p>
//         <p className="card-text"><strong>Prix:</strong> {product.price} €</p>
//         <input
//           type="number"
//           min="1"
//           className="form-control mb-2"
//           placeholder="Quantité"
//           value={quantities[product.id] || 1}
//           onChange={(e) => handleQuantityChange(product.id, e.target.value)}
//         />
//         <Button
//           className="btn btn-primary mt-auto"
//           onClick={() => handleAddToCart(product.id)}
//         >
//           Ajouter au panier
//         </Button>
//       </div>
//     </div>
//   );
// };

// const Products = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [sortBy, setSortBy] = useState('name');
//   const [viewMode, setViewMode] = useState('grid');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Get unique categories
//   const categories = Array.from(new Set(products.map(p => p.category)));

//   useEffect(() => {
//     const userId = localStorage.getItem('id');
//     if (!userId) {
//       console.error('User ID is missing in localStorage.');
//     }

//     setLoading(true);
//     axios
//       .get('http://localhost:8000/api/products')
//       .then(response => {
//         setProducts(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching products:', error);
//         setError('Failed to load products');
//         setLoading(false);
//       });
//   }, []);

//   const handleAddToCart = (productId) => {
//     const userId = localStorage.getItem('id');
//     if (!userId) {
//       console.error('User ID is missing in localStorage.');
//       return;
//     }

//     const quantity = quantities[productId] || 1;

//     axios.post('/api/cart/add', { userId, productId, quantity })
//       .then(response => {
//         console.log('Product added to cart:', response.data);
//         navigate('/cart');
//       })
//       .catch(error => console.error('Error adding product to cart:', error));
//   };

//   const handleQuantityChange = (productId, value) => {
//     const quantity = parseInt(value, 10);
//     if (!isNaN(quantity) && quantity > 0) {
//       setQuantities(prev => ({ ...prev, [productId]: quantity }));
//     } else {
//       setQuantities(prev => ({ ...prev, [productId]: 1 }));
//     }
//   };

//   // Filter and sort products
//   const filteredProducts = products
//     .filter(product => {
//       const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
//       return matchesSearch && matchesCategory;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'price-low':
//           return a.price - b.price;
//         case 'price-high':
//           return b.price - a.price;
//         case 'name':
//           return a.name.localeCompare(b.name);
//         default:
//           return 0;
//       }
//     });

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center">
//           <p className="text-destructive mb-4">Error loading products: {error}</p>
//           <Button onClick={() => window.location.reload()}>Try Again</Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Page Header */}
//       <div className="mb-8">
//         <img
//           src="/img/banner.PNG"
//           className="w-full mb-4"
//           alt="banner"
//           style={{ height: '200px', objectFit: 'cover' }}
//         />
//         <h1 className="text-3xl font-bold mb-4">Nos produits</h1>
//         <p className="text-muted-foreground">
//           Discover our complete collection of premium products
//         </p>
//       </div>

//       {/* Filters and Search */}
//       <div className="mb-8 space-y-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search */}
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//             <Input
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           {/* Category Filter */}
//           <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//             <SelectTrigger className="w-full md:w-48">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {categories.map(category => (
//                 <SelectItem key={category} value={category}>
//                   {category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Sort */}
//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="w-full md:w-48">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="name">Name A-Z</SelectItem>
//               <SelectItem value="price-low">Price: Low to High</SelectItem>
//               <SelectItem value="price-high">Price: High to Low</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* View Mode */}
//           <div className="flex gap-2">
//             <Button
//               variant={viewMode === 'grid' ? 'default' : 'outline'}
//               size="sm"
//               onClick={() => setViewMode('grid')}
//             >
//               <Grid className="h-4 w-4" />
//             </Button>
//             <Button
//               variant={viewMode === 'list' ? 'default' : 'outline'}
//               size="sm"
//               onClick={() => setViewMode('list')}
//             >
//               <List className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         {/* Active Filters */}
//         <div className="flex flex-wrap gap-2">
//           {searchTerm && (
//             <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm('')}>
//               Search: {searchTerm} ×
//             </Badge>
//           )}
//           {selectedCategory !== 'all' && (
//             <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
//               Category: {selectedCategory} ×
//             </Badge>
//           )}
//         </div>
//       </div>

//       {/* Results Count */}
//       <div className="mb-6">
//         <p className="text-muted-foreground">
//           Showing {filteredProducts.length} of {products.length} products
//         </p>
//       </div>

//       {/* Products Grid */}
//       {loading ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {[...Array(8)].map((_, i) => (
//             <div key={i} className="animate-pulse">
//               <div className="bg-muted rounded-lg h-64 mb-4"></div>
//               <div className="bg-muted rounded h-4 mb-2"></div>
//               <div className="bg-muted rounded h-4 w-2/3"></div>
//             </div>
//           ))}
//         </div>
//       ) : filteredProducts.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria</p>
//           <Button onClick={() => {
//             setSearchTerm('');
//             setSelectedCategory('all');
//           }}>
//             Clear Filters
//           </Button>
//         </div>
//       ) : (
//         <div className={
//           viewMode === 'grid'
//             ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//             : "space-y-4"
//         }>
//           {filteredProducts.map(product => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               viewMode={viewMode}
//               quantities={quantities}
//               handleQuantityChange={handleQuantityChange}
//               handleAddToCart={handleAddToCart}
//             />
//           ))}

          
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;