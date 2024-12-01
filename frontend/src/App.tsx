import "./App.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useQuery
} from "@tanstack/react-query"

import { api } from "@/lib/api";
import { formatter } from "@/lib/utils"

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();

  if(res.ok == false)
      throw new Error("Failed to fetch total spent");

  const data = await res.json();

  return data;
}

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ["total-spent"],
    queryFn: getTotalSpent,
  });

  if(error) return "An error occurred: " + error.message;

  return (
    <>
      <Card className="m-auto w-[350px]">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>
          { isPending ? "..." : formatter.format( Number(data.totalSpent) )}
        </CardContent>
      </Card>
    </>
  );
}

export default App;
