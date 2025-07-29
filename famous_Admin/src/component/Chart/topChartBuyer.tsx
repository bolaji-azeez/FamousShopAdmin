"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { topBuyersData } from "../../data/chatdata"
import { Crown, TrendingUp } from "lucide-react"

export function TopBuyersChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Top Buyers
        </CardTitle>
        <CardDescription>Customers with highest purchase value</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topBuyersData.map((buyer, index) => (
            <div key={buyer.email} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {buyer.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1">
                      <Crown className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{buyer.name}</p>
                  <p className="text-xs text-muted-foreground">{buyer.email}</p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">${buyer.totalSpent.toLocaleString()}</span>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {buyer.orders} orders
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}