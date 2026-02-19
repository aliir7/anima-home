import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  specs: Record<string, string>;
};

export function ProductSpecs({ specs }: Props) {
  const entries = Object.entries(specs);

  if (entries.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-primary text-base">مشخصات فنی</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {entries.map(([label, value]) => (
          <div key={label} className="grid grid-cols-2 gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
