import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CreateScenarioDialog() {
  return (
    <Link href="/admin/dashboard/scenarios/new">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Create Scenario
      </Button>
    </Link>
  );
}
