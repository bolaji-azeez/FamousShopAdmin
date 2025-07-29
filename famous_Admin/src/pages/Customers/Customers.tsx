"use client"

import { Eye, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockCustomers = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john@example.com",
    orders: 5,
    totalSpent: "$15,200",
    status: "active",
    joinDate: "2024-01-10",
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane@example.com",
    orders: 3,
    totalSpent: "$8,400",
    status: "active",
    joinDate: "2024-01-08",
  },
]

export default function CustomersPage() {
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

      {/* Desktop Table */}
      <Card className="hidden md:block overflow-x-auto p-3">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Customer ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.orders}</TableCell>
                <TableCell>{customer.totalSpent}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>{customer.joinDate}</TableCell>
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

      {/* Mobile Card Layout */}
      <div className="grid gap-4 md:hidden">
        {mockCustomers.map((customer) => (
          <Card key={customer.id} className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{customer.name}</p>
              <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                {customer.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
            <p className="text-sm">Orders: {customer.orders}</p>
            <p className="text-sm">Total Spent: {customer.totalSpent}</p>
            <p className="text-xs text-muted-foreground">Joined: {customer.joinDate}</p>
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
  )
}
