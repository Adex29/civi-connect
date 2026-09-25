import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Load environment variables from .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      const val = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;
const dataDir = path.join(process.cwd(), "data");

// 2. Define the new mission from the specification PDF verbatim
const SCENARIO_ID = "san-isidro-drainage-crisis";
const CLASSROOM_ID = "KGacUYKN3j-Q3RHxWqp_j"; // CVC-3A

const newMission = {
  id: SCENARIO_ID,
  title: "Barangay San Isidro: Drainage and Waste Management",
  description:
    "For several weeks, residents of a small neighborhood in Barangay San Isidro have noticed that rainwater remains on the street for hours after heavy rain. The affected area is a narrow street shared by eight neighboring households. Residents observed that the drainage canal beside the houses is often clogged with plastic wrappers, leaves, and other household waste. Some residents also place their household garbage near the canal before collection, and some of it is carried into the drainage during rainy weather.\n\nThree pieces of evidence support this possible cause: residents found accumulated plastic and food packaging inside the clogged canal, several households reported seeing garbage being washed toward the canal during rain, and the water flows normally after the canal is manually cleared.\n\nThe stagnant water makes it difficult for residents, especially children and older people, to pass through the street safely. It also creates an unpleasant smell and may attract mosquitoes and other pests. The problem has become more noticeable because the rainy season has brought heavier rainfall in recent days.\n\nThe neighborhood association has suggested that the affected households work together instead of waiting for outside assistance. The residents can potentially address the problem by cleaning the canal, properly managing household waste, and agreeing on a simple schedule for monitoring the drainage. However, some households may be unwilling to participate because of work schedules or the belief that cleaning the canal is someone else’s responsibility.\n\nThe community mission is to reduce the stagnant water problem and establish a simple waste-and-drainage practice within seven days through the cooperation of the affected households.",
  context:
    "Barangay San Isidro neighborhood drainage canal maintenance and ecological household solid waste management under R.A. 9003 and local community action principles.",
  constraints: [
    "Reduce the stagnant water problem and establish a simple waste-and-drainage practice within seven days.",
    "Mobilize cooperation among the eight affected neighboring households without relying on outside assistance.",
    "Propose a realistic, manageable community action initiative addressing waste placement and canal maintenance."
  ],
  status: "active",
  createdBy: "admin-1",
  createdAt: new Date().toISOString(),
  missionData: {
    scenarioId: SCENARIO_ID,
    issues: [
      "Clogged drainage canal causing stagnant water on the neighborhood street.",
      "Lack of regular drainage cleaning and monitoring.",
      "Possible increase in mosquitoes and pests.",
      "Some residents who may be unwilling or unavailable to participate."
    ],
    issueOptions: [
      {
        id: "issue-1",
        text: "Clogged drainage canal causing stagnant water on the neighborhood street.",
        isCorrect: true
      },
      {
        id: "issue-2",
        text: "Lack of regular drainage cleaning and monitoring.",
        isCorrect: false
      },
      {
        id: "issue-3",
        text: "Possible increase in mosquitoes and pests.",
        isCorrect: false
      },
      {
        id: "issue-4",
        text: "Some residents who may be unwilling or unavailable to participate.",
        isCorrect: false
      }
    ],
    correctIssue: "Clogged drainage canal causing stagnant water on the neighborhood street.",
    causes: [
      {
        id: "c1",
        title: "Improper disposal or temporary placement of household waste near the canal",
        description: "Garbage can be washed into the drainage during rain."
      },
      {
        id: "c2",
        title: "Accumulation of leaves, plastic, and other debris in the drainage canal",
        description: "These materials restrict the flow of water."
      },
      {
        id: "c3",
        title: "Lack of regular community cleaning and monitoring",
        description: "Without a shared maintenance practice, the canal can become clogged again."
      },
      {
        id: "c4",
        title: "Heavy rainfall",
        description: "Increased rainwater can worsen the effects of an already clogged drainage system."
      }
    ],
    evidenceLibrary: [
      {
        id: "ev1",
        title: "Accumulated Waste in Drainage Canal",
        type: "Field Observation",
        snippet: "Residents found accumulated plastic wrappers, food packaging, leaves, and other waste inside the clogged canal.",
        fullText: "Residents found accumulated plastic wrappers, food packaging, leaves, and other waste inside the clogged canal.",
        defaultCredibility: 4,
        supports: ["cause"],
        isIrrelevant: false
      },
      {
        id: "ev2",
        title: "Household Waste Wash-off Reports",
        type: "Household Report",
        snippet: "Several households reported seeing garbage being carried toward the canal during rainfall.",
        fullText: "Several households reported seeing garbage being carried toward the canal during rainfall.",
        defaultCredibility: 4,
        supports: ["cause"],
        isIrrelevant: false
      },
      {
        id: "ev3",
        title: "Manual Canal Clearance Water Flow Test",
        type: "Drainage Test",
        snippet: "Water flows normally after the canal is manually cleared.",
        fullText: "Water flows normally after the canal is manually cleared.",
        defaultCredibility: 4,
        supports: ["solution"],
        isIrrelevant: false
      },
      {
        id: "ev4",
        title: "Resident Rainy Weather Indoor Preference",
        type: "Community Survey",
        snippet: "Many residents prefer to stay indoors when it rains.",
        fullText: "Many residents prefer to stay indoors when it rains.",
        defaultCredibility: 0,
        supports: ["not_related"],
        isIrrelevant: true
      }
    ],
    stakeholders: [
      {
        id: "st1",
        name: "Affected Household Representative",
        role: "Resident of the affected street",
        initialStatement: "I live on this street, and I’ve noticed that water stays on the road for a long time whenever it rains. I’ve seen plastic wrappers, food containers, leaves, and other waste blocking parts of the drainage canal. Some of the garbage seems to come from households nearby, especially when rainwater carries it toward the canal. I’m concerned because children and older residents have difficulty passing through the flooded area. I’m willing to help organize the neighbors for a cleanup, but we need to agree on a schedule when most households are available.",
        statement: "I live on this street, and I’ve noticed that water stays on the road for a long time whenever it rains. I’ve seen plastic wrappers, food containers, leaves, and other waste blocking parts of the drainage canal. Some of the garbage seems to come from households nearby, especially when rainwater carries it toward the canal. I’m concerned because children and older residents have difficulty passing through the flooded area. I’m willing to help organize the neighbors for a cleanup, but we need to agree on a schedule when most households are available.",
        isIrrelevant: false
      },
      {
        id: "st2",
        name: "Neighborhood Association Leader",
        role: "Community organizer",
        initialStatement: "As the neighborhood association leader, I’ve received complaints about the stagnant water. We have organized cleanups before, but participation has not always been consistent. I believe the problem will continue if we only clean the canal without addressing how garbage is placed near it. I can help coordinate the affected households, assign simple tasks, and arrange a schedule for cleaning and monitoring the drainage. However, participation is voluntary, so we need to encourage residents to cooperate rather than force them.",
        statement: "As the neighborhood association leader, I’ve received complaints about the stagnant water. We have organized cleanups before, but participation has not always been consistent. I believe the problem will continue if we only clean the canal without addressing how garbage is placed near it. I can help coordinate the affected households, assign simple tasks, and arrange a schedule for cleaning and monitoring the drainage. However, participation is voluntary, so we need to encourage residents to cooperate rather than force them.",
        isIrrelevant: false
      },
      {
        id: "st3",
        name: "Local Waste Collection Worker",
        role: "Waste-management worker serving the area",
        initialStatement: "I regularly collect household waste in this neighborhood, and I’ve noticed that some residents place their garbage outside too early or leave it close to the drainage canal. When it rains before collection, lightweight waste can be carried into the canal. The regular collection schedule can help if residents place their garbage out at the proper time and in the proper location. I can explain the collection schedule and suggest ways households can prevent their waste from reaching the drainage. However, I cannot personally monitor every household or clean the canal regularly.",
        statement: "I regularly collect household waste in this neighborhood, and I’ve noticed that some residents place their garbage outside too early or leave it close to the drainage canal. When it rains before collection, lightweight waste can be carried into the canal. The regular collection schedule can help if residents place their garbage out at the proper time and in the proper location. I can explain the collection schedule and suggest ways households can prevent their waste from reaching the drainage. However, I cannot personally monitor every household or clean the canal regularly.",
        isIrrelevant: false
      },
      {
        id: "st4",
        name: "Nearby Store Owner",
        role: "Business owner near the affected street",
        initialStatement: "I’ve noticed that the street becomes difficult to pass whenever it rains, and some customers complain about the water. I also see residents passing through the area every day. I don’t really know what is causing the drainage to become clogged, though. My main concern is keeping my store open and serving customers. I can share what I’ve observed about the street, but I don’t have much information about the drainage system or household waste practices.",
        statement: "I’ve noticed that the street becomes difficult to pass whenever it rains, and some customers complain about the water. I also see residents passing through the area every day. I don’t really know what is causing the drainage to become clogged, though. My main concern is keeping my store open and serving customers. I can share what I’ve observed about the street, but I don’t have much information about the drainage system or household waste practices.",
        isIrrelevant: true
      }
    ],
    challenges: [
      {
        id: "challenge-stakeholder-san-isidro",
        category: "stakeholder",
        categoryLabel: "Stakeholder Challenge",
        title: "Stakeholder Challenge",
        description: "A stakeholder who was expected to help is no longer available or cannot participate.",
        affectedField: "stakeholders",
        editableFields: ["stakeholders"]
      },
      {
        id: "challenge-budget-san-isidro",
        category: "budget",
        categoryLabel: "Budget Challenge",
        title: "Budget Challenge",
        description: "The proposed budget is unavailable, reduced, or insufficient to conduct the planned activity.",
        affectedField: "budget",
        editableFields: ["budget"]
      },
      {
        id: "challenge-resource-san-isidro",
        category: "resource",
        categoryLabel: "Resource Challenge",
        title: "Resource Challenge",
        description: "An important material, facility, or resource needed for the activity is unavailable.",
        affectedField: "resources",
        editableFields: ["resources"]
      }
    ],
    unexpectedEvent: {
      title: "Stakeholder Challenge: Volunteer Mobilizer Unavailable",
      description: "A stakeholder who was expected to help is no longer available or cannot participate.",
      options: [
        {
          id: "opt1",
          text: "Reassign coordination duties among available neighboring households and proceed with the cleanup.",
          isOptimal: true,
          feedback: "Great adaptive decision! Relying on collective neighborhood initiative ensures community resilience."
        },
        {
          id: "opt2",
          text: "Cancel the drainage cleanup entirely and wait for municipal intervention.",
          isOptimal: false,
          feedback: "Canceling the cleanup leaves the drainage clogged and exacerbates stagnant water hazards."
        }
      ]
    },
    stepTips: {
      "1": "Read the community situation carefully. Differentiate the main immediate problem from secondary symptoms before deciding which issue to address first.",
      "2": "Analyze the causal chain. Consider how waste placement and debris accumulation trigger the drainage blockage.",
      "3": "Evaluate each piece of evidence carefully. Determine whether it proves a cause, suggests a solution, or is irrelevant to the drainage issue.",
      "4": "Consult stakeholders whose roles directly connect to neighborhood cleanup, waste collection schedules, and community organization.",
      "5": "Ensure your community action plan is realistic, manageable, and can be completed within the 7-day scope through household cooperation.",
      "6": "Be prepared to adapt when unexpected community conditions change.",
      "7": "Revise the specific component of your intervention plan affected by the challenge while keeping the rest of your plan intact."
    }
  }
};

const newClassroomScenario = {
  id: `cs-${SCENARIO_ID}-cvc3a`,
  classroomId: CLASSROOM_ID,
  scenarioId: SCENARIO_ID,
  isActive: true,
  assignedAt: new Date().toISOString()
};

async function runCleanupAndSeed() {
  console.log("🧹 Starting Mission Clean-up and Seeding...\n");

  // 1. Update Local JSON Files
  console.log("Updating local JSON data files...");
  fs.writeFileSync(path.join(dataDir, "scenarios.json"), JSON.stringify([newMission], null, 2), "utf-8");
  console.log("✓ data/scenarios.json updated with 1 mission:", newMission.title);

  fs.writeFileSync(path.join(dataDir, "classroom-scenarios.json"), JSON.stringify([newClassroomScenario], null, 2), "utf-8");
  console.log("✓ data/classroom-scenarios.json updated (assigned to CVC-3A)");

  // Clean out stale submissions, constraints, and assignments
  fs.writeFileSync(path.join(dataDir, "submissions.json"), JSON.stringify([], null, 2), "utf-8");
  console.log("✓ data/submissions.json reset to empty array");

  fs.writeFileSync(path.join(dataDir, "constraints.json"), JSON.stringify([], null, 2), "utf-8");
  console.log("✓ data/constraints.json reset to empty array");

  fs.writeFileSync(path.join(dataDir, "assignments.json"), JSON.stringify([], null, 2), "utf-8");
  console.log("✓ data/assignments.json reset to empty array");

  // 2. Clean up and Seed Supabase if configured
  if (isSupabaseConfigured && supabase) {
    console.log("\nConnecting to Supabase at:", supabaseUrl);

    // Delete existing submissions (cascade or explicit)
    const { error: subErr } = await supabase.from("submissions").delete().neq("id", "___none___");
    if (subErr) console.warn("Notice deleting submissions:", subErr.message);
    else console.log("✓ Supabase: Cleaned all old submissions");

    // Delete existing classroom_scenarios
    const { error: csErr } = await supabase.from("classroom_scenarios").delete().neq("id", "___none___");
    if (csErr) console.warn("Notice deleting classroom_scenarios:", csErr.message);
    else console.log("✓ Supabase: Cleaned all old classroom scenario assignments");

    // Delete existing constraints
    const { error: conErr } = await supabase.from("constraints").delete().neq("id", "___none___");
    if (conErr) console.warn("Notice deleting constraints:", conErr.message);
    else console.log("✓ Supabase: Cleaned all old constraints");

    // Delete existing assignments
    const { error: asErr } = await supabase.from("assignments").delete().neq("id", "___none___");
    if (asErr) console.warn("Notice deleting assignments:", asErr.message);
    else console.log("✓ Supabase: Cleaned all old assignments");

    // Delete all existing scenarios
    const { error: scErr } = await supabase.from("scenarios").delete().neq("id", "___none___");
    if (scErr) console.warn("Notice deleting scenarios:", scErr.message);
    else console.log("✓ Supabase: Cleaned all old scenarios");

    // Seed the single new mission
    const formattedScenario = {
      id: newMission.id,
      title: newMission.title,
      description: newMission.description,
      context: newMission.context || null,
      constraints: newMission.constraints || [],
      mission_data: newMission.missionData || null,
      status: newMission.status || "active",
      created_by: newMission.createdBy || null,
      created_at: newMission.createdAt,
    };

    const { error: insertScErr } = await supabase.from("scenarios").insert([formattedScenario]);
    if (insertScErr) {
      console.error("Error inserting scenario into Supabase:", insertScErr.message);
    } else {
      console.log("✓ Supabase: Seeded new mission:", newMission.title);
    }

    // Seed the classroom scenario assignment
    const formattedCS = {
      id: newClassroomScenario.id,
      classroom_id: newClassroomScenario.classroomId,
      scenario_id: newClassroomScenario.scenarioId,
      is_active: newClassroomScenario.isActive,
      assigned_at: newClassroomScenario.assignedAt,
    };

    const { error: insertCSErr } = await supabase.from("classroom_scenarios").insert([formattedCS]);
    if (insertCSErr) {
      console.error("Error inserting classroom_scenarios into Supabase:", insertCSErr.message);
    } else {
      console.log("✓ Supabase: Assigned new mission to classroom CVC-3A");
    }

    // Verification check in Supabase
    const { data: dbScenarios, count: scCount } = await supabase.from("scenarios").select("*", { count: "exact" });
    const { data: dbCS, count: csCount } = await supabase.from("classroom_scenarios").select("*", { count: "exact" });
    const { data: dbSubs, count: subCount } = await supabase.from("submissions").select("*", { count: "exact" });

    console.log("\n📊 Supabase Verification:");
    console.log(`- Scenarios count: ${dbScenarios?.length || 0}`);
    if (dbScenarios && dbScenarios.length > 0) {
      console.log(`  -> ID: ${dbScenarios[0].id}, Title: "${dbScenarios[0].title}"`);
    }
    console.log(`- Classroom assignments count: ${dbCS?.length || 0}`);
    console.log(`- Submissions count: ${dbSubs?.length || 0}`);
  } else {
    console.log("\n⚠️ Supabase not configured in environment. Local files updated successfully.");
  }

  console.log("\n✨ Mission cleanup and seeding completed successfully!");
}

runCleanupAndSeed().catch((err) => {
  console.error("Cleanup and seed failed:", err);
  process.exit(1);
});
