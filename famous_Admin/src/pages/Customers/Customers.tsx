"use client";

import { useMemo, useState } from "react";
import { Eye, Mail } from "lucide-react";
import { useGetUsersQuery } from "@/features/users/userApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type  FetchBaseQueryError } from "@reduxjs/toolkit/query";

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export default function CustomersPage() {
  const { data: users = [], isLoading, isError, error } = useGetUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter((user: User) => {
      const nameMatch = (user.fullName ?? "").toLowerCase().includes(term);
      if (!dateFilter) return nameMatch;

      const userDay = new Date(user.createdAt).toISOString().split("T")[0];
      const dateMatch = userDay === dateFilter;
      return nameMatch && dateMatch;
    });
  }, [users, searchTerm, dateFilter]);

  function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === "object" && error != null && "data" in error;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage your customer base</p>
        </div>
      </div>

      {/* Search / Date */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Input
          placeholder="Search customers by name..."
          className="w-full sm:max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Input
          type="date"
          className="w-48 sm:max-w-sm"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Loading / Error */}
      {isLoading && <Card className="p-4">Loading customers…</Card>}
      {isError && (
        <Card className="p-4 text-red-600">
          {isFetchBaseQueryError(error)
            ? (error.data as { message?: string })?.message ??
              "Failed to load customers"
            : "Failed to load customers"}
        </Card>
      )}

      {/* Desktop Table */}
      {!isLoading && !isError && (
        <Card className="hidden md:block overflow-x-auto p-3">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user: User) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user._id.slice(-4)}
                  </TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Mobile Cards */}
      {!isLoading && !isError && (
        <div className="grid gap-4 md:hidden">
          {filteredUsers.map((user: User) => (
            <Card key={user._id} className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{user.fullName}</p>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm">Role: {user.role}</p>
              <p className="text-xs text-muted-foreground">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
