"use client";

import React, { useEffect } from "react";
import { Eye, Mail } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchUsers } from "@/features/users/usersSlice"; // adjust path if needed
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

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  const status = useAppSelector((state) => state.users.status);
  const error = useAppSelector((state) => state.users.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">Manage your customer base</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Input placeholder="Search customers..." className="w-full sm:max-w-sm" />
      </div>

      {status === "loading" && <p>Loading customers...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Desktop Table */}
      <Card className="hidden md:block overflow-x-auto p-3">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Customer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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

      {/* Mobile View */}
      <div className="grid gap-4 md:hidden">
        {users.map((user) => (
          <Card key={user.id} className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{user.name}</p>
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
    </div>
  );
}
