import {
  CauseItem,
  EvidenceItem,
  Stakeholder,
  UnexpectedEvent,
  Scenario,
} from "./definitions";

export interface MissionData {
  scenarioId: string;
  issues: string[]; // Options for Step 1
  causes: CauseItem[]; // Step 2 items to rank
  evidenceLibrary: EvidenceItem[]; // Step 3 sources
  stakeholders: Stakeholder[]; // Step 4 interviewees
  unexpectedEvent: UnexpectedEvent; // Step 6 challenge
  stepTips: Record<number, string>; // Step 1-7 tips
}

export function getMissionDataForScenario(scenario: Scenario): MissionData {
  // If scenario has custom database-stored missionData, return it directly
  if (scenario.missionData) {
    const baseFallback = getGenericFallbackMissionData(scenario);
    return {
      scenarioId: scenario.id,
      issues: scenario.missionData.issues?.length ? scenario.missionData.issues : baseFallback.issues,
      causes: scenario.missionData.causes?.length ? scenario.missionData.causes : baseFallback.causes,
      evidenceLibrary: scenario.missionData.evidenceLibrary?.length ? scenario.missionData.evidenceLibrary : baseFallback.evidenceLibrary,
      stakeholders: scenario.missionData.stakeholders?.length ? scenario.missionData.stakeholders : baseFallback.stakeholders,
      unexpectedEvent: scenario.missionData.unexpectedEvent || baseFallback.unexpectedEvent,
      stepTips: scenario.missionData.stepTips || baseFallback.stepTips,
    };
  }

  // Fallback for new empty scenarios before admin customization
  return getGenericFallbackMissionData(scenario);
}

export function getGenericFallbackMissionData(scenario: Scenario): MissionData {
  return {
    scenarioId: scenario.id,
    issues: [
      `${scenario.title}: Primary Systemic Issue`,
      "Lack of Community Participation & Engagement",
      "Inadequate Policy & Ordinance Enforcement",
      "Limited Resource Allocation & Funding",
    ],
    causes: [
      { id: "c1", title: "Weak Regulatory Enforcement", description: "Local officials struggle to enforce ordinances strictly." },
      { id: "c2", title: "Resource & Budget Limitations", description: "Insufficient financial and material resources for full implementation." },
      { id: "c3", title: "Low Community Awareness", description: "Lack of public information campaigns targeting residents." },
      { id: "c4", title: "Infrastructure & Logistical Bottlenecks", description: "Physical constraints in the barangay hinder service delivery." },
      { id: "c5", title: "Coordination Gaps Across Stakeholders", description: "Misalignment between LGU, barangay, and private citizens." },
    ],
    evidenceLibrary: [
      {
        id: "ev1",
        title: "Official Barangay Health & Safety Audit",
        type: "Government Report",
        snippet: "Documented evaluation of community indicators and statutory compliance.",
        fullText: `Comprehensive LGU evaluation report confirming the severity of ${scenario.title} across all barangay zones.`,
        defaultCredibility: 5,
        supports: ["cause", "need"],
      },
      {
        id: "ev2",
        title: "Community Household Survey Results",
        type: "Community Survey",
        snippet: "Feedback from 150 local households detailing daily challenges.",
        fullText: "Survey indicates 82% of residents cite lack of clear guidelines and local assistance as their main obstacle.",
        defaultCredibility: 4,
        supports: ["need", "solution"],
      },
      {
        id: "ev3",
        title: "Photographic Evidence Log",
        type: "Article Photo",
        snippet: "Visual inspection logs showing affected areas in Sitio 1 and Sitio 3.",
        fullText: "Photographic documentation proving urgent intervention is required to safeguard public health and order.",
        imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80",
        defaultCredibility: 4,
        supports: ["cause"],
      },
      {
        id: "ev4",
        title: "Barangay Fiscal Allocation Statement",
        type: "Budget Report",
        snippet: "Financial audit of current project expenditures and available funds.",
        fullText: "Financial statement confirming available discretionary budget that can be mobilized for community solutions.",
        defaultCredibility: 5,
        supports: ["solution"],
      },
      {
        id: "ev5",
        title: "Local Media Investigative Report",
        type: "Survey News",
        snippet: "News feature highlighting local resident complaints and official responses.",
        fullText: "Investigative report outlining public perception and systemic obstacles in municipal coordination.",
        defaultCredibility: 4,
        supports: ["need"],
      },
      {
        id: "ev6",
        title: "Resident Social Media Discussion Thread",
        type: "Social Media",
        snippet: "Online community forum thread discussing daily impacts.",
        fullText: "Public comments reflecting community frustration and suggestions for faster local action.",
        defaultCredibility: 2,
        supports: ["cause"],
      },
      {
        id: "ev7",
        title: "Expert Stakeholder Interview",
        type: "Interview",
        snippet: "Transcript with local specialist emphasizing preventative action.",
        fullText: "Expert interview highlighting that sustainable solutions require active grassroots participation.",
        defaultCredibility: 5,
        supports: ["solution", "need"],
      },
      {
        id: "ev8",
        title: "Barangay Area Sector Map",
        type: "Map",
        snippet: "Spatial analysis map identifying high-priority intervention zones.",
        fullText: "GIS map showing high-density zones requiring targeted civic programs.",
        defaultCredibility: 5,
        supports: ["cause", "solution"],
      },
    ],
    stakeholders: [
      {
        id: "st1",
        name: "Hon. Roberto Santos",
        role: "Barangay Committee Chair",
        initialStatement: "We are committed to addressing this issue, but we need practical, low-cost solutions from the youth and community.",
        followUps: [
          {
            question: "How can the Barangay Council support student-led initiatives?",
            answer: "We can pass a Barangay Resolution to formalize your program and assign Tanods or SK leaders to assist.",
          },
        ],
      },
      {
        id: "st2",
        name: "Mrs. Elena Gomez",
        role: "Community Association Leader",
        initialStatement: "Residents want to help, but previous projects failed because there was no continuous follow-through.",
        followUps: [
          {
            question: "What would motivate households to actively participate long-term?",
            answer: "Transparent reporting, recognition for active Sitio groups, and tangible improvements in our daily environment.",
          },
        ],
      },
    ],
    unexpectedEvent: {
      title: "Unexpected Challenge: Resource Allocation Adjustment",
      description: "An unexpected municipal policy shift reduced initial administrative support by 25%. How will you adapt your action plan?",
      options: [
        {
          id: "opt1",
          text: "Halt project operations until full funding is restored.",
          isOptimal: false,
          feedback: "Stopping operations causes momentum loss and leaves community issues unaddressed.",
        },
        {
          id: "opt2",
          text: "Mobilize local community volunteers and leverage existing barangay facilities.",
          isOptimal: true,
          feedback: "Great adaptive choice! Mobilizing community assets ensures resilience amidst budget changes.",
        },
        {
          id: "opt3",
          text: "Scale down objectives to cover only a single household.",
          isOptimal: false,
          feedback: "Scaling down too much fails to address the systemic community problem.",
        },
      ],
    },
    stepTips: {
      1: "Read carefully. Differentiate symptoms from root issues before prioritizing.",
      2: "Analyze cause relationships. Consider which factor triggers the others.",
      3: "Balance your evidence library. Combine official reports with community experiences.",
      4: "Gather diverse perspectives. Interview both local leaders and grassroots residents.",
      5: "Ensure your intervention plan is evidence-based, actionable, and sustainable.",
      6: "Anticipate real-world constraints. Adapt your strategy to overcome unexpected obstacles.",
      7: "Review the obstacles faced in the challenge simulation. Refine and adapt your intervention plan to make it resilient, budget-aligned, and feasible.",
      8: "Assess ethical implications and sustainability. Make sure vulnerable groups are protected and benefit.",
    },
  };
}
