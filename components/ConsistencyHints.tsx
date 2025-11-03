import { Lightbulb, Wrench } from "lucide-react";
import type { ConsistencyIssue, ConsistencyResolution } from "@/lib/consistency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ConsistencyHintsProps = {
  issues: ConsistencyIssue[];
  onApply: (resolution: ConsistencyResolution) => void;
};

const ConsistencyHints = ({ issues, onApply }: ConsistencyHintsProps) => {
  if (issues.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">Consistency Checker</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5" />
            Smooth sailing
          </Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Everything lines up. Keep experimenting—I&apos;ll flag anything quirky.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Consistency Checker</CardTitle>
        <Badge variant="outline" className="flex items-center gap-1">
          <Lightbulb className="h-3.5 w-3.5" />
          {issues.length} tip{issues.length > 1 ? "s" : ""}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {issues.map((issue) => (
          <div key={issue.id} className="space-y-2 rounded-md border border-border/60 bg-muted/40 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium">{issue.message}</p>
              <Badge variant={issue.severity === "warning" ? "destructive" : "secondary"}>{issue.severity}</Badge>
            </div>
            {issue.resolutions?.length ? (
              <div className="flex flex-wrap gap-2">
                {issue.resolutions.map((resolution) => (
                  <Button
                    key={resolution.label}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => onApply(resolution)}
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    {resolution.label}
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConsistencyHints;
