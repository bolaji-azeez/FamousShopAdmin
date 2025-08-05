
import * as React from "react"
import { Plus, Edit, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const mockBrands = [
  { id: "BRAND-001", name: "Rolex", products: 12, status: "active" },
  { id: "BRAND-002", name: "Omega", products: 8, status: "active" },
  { id: "BRAND-003", name: "TAG Heuer", products: 6, status: "active" },
]

export default function BrandsPage() {
  const [brands, setBrands] = React.useState(mockBrands)
  const [isBrandDialogOpen, setIsBrandDialogOpen] = React.useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
          <p className="text-muted-foreground">Manage watch brands in your store</p>
        </div>
        <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>Create a new brand for your watch collection</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input id="brandName" placeholder="Enter brand name" />
              </div>
              
            </div>
            <DialogFooter>
              <Button type="submit">Create Brand</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand Name</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell>{brand.products} products</TableCell>
                <TableCell>
                  <Badge variant={brand.status === "active" ? "default" : "secondary"}>{brand.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}