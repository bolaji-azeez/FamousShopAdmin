

import * as React from "react"
import { Search, Plus, Star, TrendingUp, Package, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"


// Mock products data
const mockAllProducts = [
  {
    id: "PROD-001",
    name: "Rolex Submariner",
    brand: "Rolex",
    price: 8500,
    discountedPrice: 7999,
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    description: "Iconic diving watch with exceptional craftsmanship",
    rating: 4.9,
    sales: 45,
    stock: 5,
    category: "Luxury Watches",
    status: "active",
    inTrending: false,
    inPopular: true,
  },
  {
    id: "PROD-002",
    name: "Omega Speedmaster",
    brand: "Omega",
    price: 4200,
    discountedPrice: null,
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    description: "The legendary moonwatch worn by astronauts",
    rating: 4.8,
    sales: 32,
    stock: 8,
    category: "Sports Watches",
    status: "active",
    inTrending: true,
    inPopular: false,
  },
  {
    id: "PROD-003",
    name: "TAG Heuer Carrera",
    brand: "TAG Heuer",
    price: 2800,
    discountedPrice: 2499,
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    description: "Racing-inspired chronograph with precision timing",
    rating: 4.7,
    sales: 28,
    stock: 12,
    category: "Sports Watches",
    status: "active",
    inTrending: false,
    inPopular: false,
  },
  {
    id: "PROD-004",
    name: "Seiko Prospex",
    brand: "Seiko",
    price: 350,
    discountedPrice: null,
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    description: "Professional diving watch with solar movement",
    rating: 4.5,
    sales: 67,
    stock: 25,
    category: "Sports Watches",
    status: "active",
    inTrending: false,
    inPopular: false,
  },
  {
    id: "PROD-005",
    name: "Casio G-Shock",
    brand: "Casio",
    price: 120,
    discountedPrice: 99,
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    description: "Rugged digital watch built for extreme conditions",
    rating: 4.6,
    sales: 89,
    stock: 50,
    category: "Digital Watches",
    status: "active",
    inTrending: false,
    inPopular: false,
  },
]

const brands = ["All Brands", "Rolex", "Omega", "TAG Heuer", "Seiko", "Casio"]

export default function AddToSectionModal({ isOpen, onClose, section, onAddProducts }) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedBrand, setSelectedBrand] = React.useState("All Brands")
  const [selectedProducts, setSelectedProducts] = React.useState([])
  const [sortBy, setSortBy] = React.useState("name")

  const filteredProducts = React.useMemo(() => {
    const filtered = mockAllProducts.filter((product) => {
      // Filter out products already in the current section
      if (section === "trending" && product.inTrending) return false
      if (section === "popular" && product.inPopular) return false

      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Brand filter
      if (selectedBrand !== "All Brands" && product.brand !== selectedBrand) {
        return false
      }

      // Category filter
     
      return product.status === "active"
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "sales":
          return b.sales - a.sales
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedBrand, sortBy, section])

  const handleProductSelect = (productId, isSelected) => {
    if (isSelected) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    }
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    }
  }

  const handleAddToSection = () => {
    const productsToAdd = mockAllProducts.filter((p) => selectedProducts.includes(p.id))
    onAddProducts(section, productsToAdd)
    setSelectedProducts([])
    onClose()
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedBrand("All Brands")
    setSortBy("name")
    setSelectedProducts([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {section === "trending" ? (
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                ) : (
                  <Star className="h-6 w-6 text-yellow-500" />
                )}
                Add to {section === "trending" ? "Trending" : "Popular"} Products
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                Select products to feature in the {section} section of your homepage
              </DialogDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {selectedProducts.length} selected
            </Badge>
          </div>
        </DialogHeader>

        {/* Filters */}
        <div className="space-y-4 pb-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="sales">Best Selling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                  Select All ({filteredProducts.length})
                </label>
              </div>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Showing {filteredProducts.length} products</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedProducts.includes(product.id) ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => handleProductSelect(product.id, !selectedProducts.includes(product.id))}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <Badge variant="outline" className="text-xs">
                          {product.brand}
                        </Badge>
                      </div>

                      <div className="relative group">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg border transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-lg" />
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm line-clamp-1">{product.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {product.discountedPrice ? (
                              <>
                                <span className="font-bold text-sm">${product.discountedPrice}</span>
                                <span className="text-xs text-muted-foreground line-through">${product.price}</span>
                              </>
                            ) : (
                              <span className="font-bold text-sm">${product.price}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{product.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{product.sales} sold</span>
                          <span>{product.stock} in stock</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {selectedProducts.length > 0 && (
                <span>
                  {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleAddToSection} disabled={selectedProducts.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add to {section === "trending" ? "Trending" : "Popular"} ({selectedProducts.length})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
