import { findScenarioById } from "@/lib/db";
import { notFound } from "next/navigation";
import { ScenarioForm } from "../../scenario-form";

interface EditScenarioPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditScenarioPage({ params }: EditScenarioPageProps) {
  const { id } = await params;
  const scenario = await findScenarioById(id);

  if (!scenario) {
    notFound();
  }

  return <ScenarioForm scenario={scenario} />;
}
