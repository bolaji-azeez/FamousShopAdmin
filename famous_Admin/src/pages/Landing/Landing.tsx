

import { Plus, X, Star, TrendingUp, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import * as React from "react"
import AddToSectionModal from "./addToSectionModal"

const mockTrendingProducts = [
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
  },
  {
    id: "PROD-006",
    name: "Breitling Navitimer",
    brand: "Breitling",
    price: 5200,
    discountedPrice: 4899,
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    description: "Aviation chronograph with slide rule bezel",
    rating: 4.7,
    sales: 24,
  },
]

const mockPopularProducts = [
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
  },
]

export default function LandingPage() {
  const [trendingProducts, setTrendingProducts] = React.useState(mockTrendingProducts)
  const [popularProducts, setPopularProducts] = React.useState(mockPopularProducts)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [currentSection, setCurrentSection] = React.useState("")

  const handleAddToSection = (section) => {
    setCurrentSection(section)
    setIsModalOpen(true)
  }

  const handleAddProducts = (section, products) => {
    if (section === "trending") {
      setTrendingProducts([...trendingProducts, ...products])
    } else {
      setPopularProducts([...popularProducts, ...products])
    }
  }

  const handleRemoveProduct = (section, productId) => {
    if (section === "trending") {
      setTrendingProducts(trendingProducts.filter((p) => p.id !== productId))
    } else {
      setPopularProducts(popularProducts.filter((p) => p.id !== productId))
    }
  }

  const ProductCard = ({ product, section, onRemove }) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

    React.useEffect(() => {
      if (isHovered && product.images.length > 1) {
        const interval = setInterval(() => {
          setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
        }, 1000)
        return () => clearInterval(interval)
      } else {
        setCurrentImageIndex(0)
      }
    }, [isHovered, product.images.length])

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Image with hover effect */}
            <div
              className="relative h-48 overflow-hidden bg-gray-300"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
              />

              {/* Overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Image indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Action buttons on hover */}
              <div
                className={`absolute top-2 right-2 flex space-x-2 transition-all duration-300 ${
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                }`}
              >
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              {/* Discount badge */}
              {product.discountedPrice && (
                <div className="absolute top-2 left-2">
                  <Badge variant="destructive" className="text-xs">
                    {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                  </Badge>
                </div>
              )}

              {/* Brand badge */}
              <div className="absolute bottom-2 right-2">
                <Badge variant="outline" className="bg-white/90 text-xs">
                  {product.brand}
                </Badge>
              </div>
            </div>

            {/* Product info */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(section, product.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {product.discountedPrice ? (
                    <>
                      <span className="font-bold text-lg">${product.discountedPrice.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-lg">${product.price.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{product.sales} sold this month</span>
                <div className="flex items-center gap-1">
                  {section === "trending" ? (
                    <TrendingUp className="h-3 w-3 text-orange-500" />
                  ) : (
                    <Star className="h-3 w-3 text-yellow-500" />
                  )}
                  <span className="capitalize">{section}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Landing Page Management</h2>
        <p className="text-muted-foreground">Manage trending and popular products on your homepage</p>
      </div>

      <Tabs defaultValue="trending" className="space-y-4 ">
        <TabsList className="grid w-full grid-cols-2 border-2">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-3 w-4" />
            Trending Products
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <Star className="h-3 w-4" />
            Popular Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Trending Products
              </h3>
              <p className="text-sm text-muted-foreground">
                Products currently trending - shown prominently on homepage
              </p>
            </div>
            <Button onClick={() => handleAddToSection("trending")} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add to Trending
            </Button>
          </div>

          {trendingProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No trending products</h3>
              <p className="text-muted-foreground mb-4">Add products to showcase as trending on your homepage</p>
              <Button onClick={() => handleAddToSection("trending")} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Products
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} section="trending" onRemove={handleRemoveProduct} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Popular Products
              </h3>
              <p className="text-sm text-muted-foreground">Most popular products based on sales and ratings</p>
            </div>
            <Button onClick={() => handleAddToSection("popular")} className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="h-4 w-4 mr-2" />
              Add to Popular
            </Button>
          </div>

          {popularProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No popular products</h3>
              <p className="text-muted-foreground mb-4">Add products to showcase as popular on your homepage</p>
              <Button onClick={() => handleAddToSection("popular")} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Products
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} section="popular" onRemove={handleRemoveProduct} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddToSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        section={currentSection}
        onAddProducts={handleAddProducts}
      />
    </div>
  )
}