"use client";

import * as React from "react";
import { useEffect } from "react";
import { fetchProduct } from "@/features/products/productsSlice";
import { fetchBrands } from "@/features/brand/brandSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Upload,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
 const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const status = useAppSelector((state) => state.products.status);
  const brands = useAppSelector((state) => state.brand.items);
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any>(null);

  useEffect(() => {
    dispatch(fetchProduct());  // ✅ load products once on mount
    dispatch(fetchBrands());    // ✅ load brands once on mount
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog
          open={isProductDialogOpen}
          onOpenChange={setIsProductDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update product information"
                  : "Create a new product for your store"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.name}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Textarea
                  id="features"
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>
              <div className="space-y-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="Search products..." className="max-w-sm" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.name}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{product.brand}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingProduct(product);
                        setIsProductDialogOpen(true);
                      }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="rounded border"
                    />
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Stock: {product.stock}</span>
                  <Badge
                    variant={
                      product.status === "active" ? "default" : "secondary"
                    }>
                    {product.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
