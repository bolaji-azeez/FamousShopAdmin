// "use client";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { salesData } from "../../data/chatdata";


// interface SalesOverviewChartProps {
//   data: {
//     month: string;
//     sales: number;
//   }[];
// }

// export const SalesOverviewChart = ({ data }: SalesOverviewChartProps) => {
//   return (
//     <Card className="col-span-4">
//       <CardHeader>
//         <CardTitle>Sales Overview</CardTitle>
//         <CardDescription>
//           Monthly sales performance for the current year
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pl-2">
//         <ResponsiveContainer width="100%" height={350}>
//           <LineChart data={salesData}>
//             <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
//             <XAxis
//               dataKey="month"
//               className="text-sm fill-muted-foreground"
//               tick={{ fontSize: 12 }}
//             />
//             <YAxis
//               className="text-sm fill-muted-foreground"
//               tick={{ fontSize: 12 }}
//               tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
//             />
//             <Tooltip
//               content={({ active, payload, label }) => {
//                 if (active && payload && payload.length) {
//                   return (
//                     <div className="rounded-lg border bg-background p-2 shadow-sm">
//                       <div className="grid grid-cols-2 gap-2">
//                         <div className="flex flex-col">
//                           <span className="text-[0.70rem] uppercase text-muted-foreground">
//                             Month
//                           </span>
//                           <span className="font-bold text-muted-foreground">
//                             {label}
//                           </span>
//                         </div>
//                         <div className="flex flex-col">
//                           <span className="text-[0.70rem] uppercase text-muted-foreground">
//                             Sales
//                           </span>
//                           <span className="font-bold">
//                             ${payload[0].value?.toLocaleString()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 }
//                 return null;
//               }}
//             />
//             <Line
//               type="monotone"
//               dataKey="sales"
//               strokeWidth={3}
//               stroke="hsl(var(--primary))"
//               dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
//               activeDot={{
//                 r: 6,
//                 stroke: "hsl(var(--primary))",
//                 strokeWidth: 2,
//               }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// }
