import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Scenario } from "@/lib/definitions";

export function EditScenarioDialog({ scenario }: { scenario: Scenario }) {
  return (
    <Link href={`/admin/dashboard/scenarios/${scenario.id}/edit`}>
      <Button variant="outline" size="sm">
        <Edit className="mr-1 h-3.5 w-3.5" />
        Edit Mission
      </Button>
    </Link>
  );
}
