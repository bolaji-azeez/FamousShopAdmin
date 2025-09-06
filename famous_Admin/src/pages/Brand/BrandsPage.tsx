"use client";
import { useState } from "react";
import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
} from "@/features/brand/brandApi";

import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner"; // Assuming you're using shadcn/ui

export default function BrandsPage() {
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  // const [brandName, setBrandName] = useState("");

  // interface Brand {
  //   _id: string;
  //   name: string;
  //   brandId?: string; // Optional field for brand ID
  //   createdAt?: string;
  //   updatedAt?: string;
  // }
  const {
    data: getBrands = [],
    isLoading,
    isError,
    error,
  } = useGetBrandsQuery();
  const rawBrands = getBrands ?? [];

  const rows = rawBrands.map((b) => ({
    id: String(b._id ?? ""), // key-safe
    name: String(b.name ?? ""),
    // coerce productsCount to number
    productsCount:
      typeof (b as any).productsCount === "number"
        ? (b as any).productsCount
        : 0,
    // coerce status to a string, default to "active"
    status:
      typeof (b as any).status === "string" ? (b as any).status : "active",
  }));
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const [brandName, setBrandName] = useState("");

  const handleCreateBrand = async () => {
    if (!brandName.trim()) {
      toast.error("Brand name cannot be empty");
      return;
    }
    try {
      await createBrand({ name: brandName }).unwrap();
      toast.success("Brand created successfully!");
      setBrandName("");
      setIsBrandDialogOpen(false);
    } catch (err) {
      toast.error("Failed to create brand");
      console.log(err);
    }
  };

  const handleDeleteBrand = async (_id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteBrand(_id).unwrap();
        toast.success("Brand deleted successfully!");
      } catch {
        toast.error("Failed to delete brand");
      }
    }
  };

  // const handleGetBrands = async () => {
  //   try {
  //     await getBrands().unwrap();
  //     toast.success("Brands loaded successfully!");
  //   } catch (err) {
  //     toast.error("Failed to load brands");

  //     console.log(err);
  //   }
  // };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Brands</h2>
          <p className="text-muted-foreground">
            Manage watch brands in your store
          </p>
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
              <DialogDescription>
                Create a new brand for your watch collection
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  placeholder="Enter brand name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateBrand}
                disabled={isCreating} // Use isCreating instead of createStatus
              >
                {isCreating ? "Creating..." : "Create Brand"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        {isLoading && <p className="p-4">Loading...</p>}
        {isError && (
          <p className="p-4 text-red-500">
            Error: {error?.toString() || "Failed to load brands"}
          </p>
        )}
        <Table>
          <TableBody>
            {rows.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell>{brand.productsCount} products</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      brand.status === "active" ? "default" : "secondary"
                    }>
                    {brand.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBrand(brand.id)}>
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
  );
}
