import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="grid gap-5">
      <Card>
        <Skeleton className="h-8 w-52" />
        <Skeleton className="mt-4 h-4 w-80" />
      </Card>
      <div className="grid gap-5 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-4 h-10 w-28" />
            <Skeleton className="mt-4 h-24 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
