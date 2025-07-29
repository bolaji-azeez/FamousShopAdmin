

import { useState } from "react"
import { X, Plus, Upload, Package, DollarSign, Hash, Tag, FileText, Star, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const ProductForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price || 0,
    discountedPrice: initialData.discountedPrice || "",
    stock: initialData.stock || 0,
    category: initialData.category || "",
    status: initialData.status || "draft",
  })

  const [features, setFeatures] = useState(initialData.features || [])
  const [featureInput, setFeatureInput] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      discountedPrice: formData.discountedPrice || undefined,
      features,
    })
  }

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput)) {
      setFeatures([...features, featureInput])
      setFeatureInput("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddFeature()
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {initialData.name ? "Edit Product" : "Create New Product"}
        </h1>
        <p className="text-muted-foreground">
          {initialData.name ? "Update your product information" : "Add a new product to your inventory"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>Essential details about your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product in detail"
                    className="min-h-[120px] resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category *
                  </Label>
                  <Input
                    id="category"
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Luxury Watches, Sports Watches"
                    className="h-11"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Features */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Product Features
                </CardTitle>
                <CardDescription>Add key features and specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a product feature"
                    className="flex-1 h-11"
                  />
                  <Button type="button" onClick={handleAddFeature} size="default" className="px-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                {features.length > 0 && (
                  <div className="space-y-3">
                    <Separator />
                    <div className="grid gap-2">
                      {features.map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-muted/50 px-4 py-3 rounded-lg border"
                        >
                          <span className="text-sm font-medium">{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing & Inventory */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Pricing
                </CardTitle>
                <CardDescription>Set your product pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Regular Price ($) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountedPrice" className="text-sm font-medium">
                    Sale Price ($)
                  </Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                    placeholder="0.00"
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty if no discount</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-primary" />
                  Inventory & Status
                </CardTitle>
                <CardDescription>Manage stock and availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-sm font-medium">
                    Stock Quantity *
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
                    placeholder="0"
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Product Status *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="draft">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          Draft
                        </div>
                      </SelectItem>
                      <SelectItem value="archived">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          Archived
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Badge className={getStatusColor(formData.status)}>
                    {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Product Images
                </CardTitle>
                <CardDescription>Upload product photos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer group">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Drag & drop images here</p>
                      <p className="text-xs text-muted-foreground">or click to browse files</p>
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      Select Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel} className="sm:w-auto w-full bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="sm:w-auto w-full">
                <Package className="h-4 w-4 mr-2" />
                {initialData.name ? "Update Product" : "Save Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default ProductForm