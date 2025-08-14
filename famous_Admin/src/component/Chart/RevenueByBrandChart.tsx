// "use client"

// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { revenueByBrandData } from "../../data/chatdata"
// import { TrendingUp } from "lucide-react"

// export function RevenueByBrandChart() {
//   return (
//     <Card className="col-span-4">
//       <CardHeader>
//         <CardTitle>Revenue by Brand</CardTitle>
//         <CardDescription>Top performing brands with growth indicators</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={revenueByBrandData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
//             <XAxis dataKey="brand" className="text-sm fill-muted-foreground" tick={{ fontSize: 12 }} />
//             tickFormatter={(value) => `$${value / 1000}k`}
//             <Tooltip
//               content={({ active, payload, label }) => {
//                 if (active && payload && payload.length) {
//                   const data = payload[0].payload
//                   return (
//                     <div className="rounded-lg border bg-background p-3 shadow-sm">
//                       <div className="space-y-2">
//                         <p className="font-medium">{label}</p>
//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                           <div>
//                             <span className="text-muted-foreground">Revenue: </span>
//                             <span className="font-bold">${data.revenue.toLocaleString()}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <span className="text-muted-foreground">Growth: </span>
//                             <span className="font-bold text-green-600">+{data.growth}%</span>
//                             <TrendingUp className="h-3 w-3 text-green-600" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 }
//                 return null
//               }}
//             />
//             <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//         <div className="mt-4 grid grid-cols-5 gap-2">
//           {revenueByBrandData.map((brand) => (
//             <div key={brand.brand} className="text-center p-2 rounded-lg bg-muted/20">
//               <p className="text-xs font-medium">{brand.brand}</p>
//               <div className="flex items-center justify-center gap-1 mt-1">
//                 {brand.growth > 10 ? (
//                   <TrendingUp className="h-3 w-3 text-green-500" />
//                 ) : (
//                   <TrendingUp className="h-3 w-3 text-yellow-500" />
//                 )}
//                 <span className="text-xs font-bold text-green-600">+{brand.growth}%</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }