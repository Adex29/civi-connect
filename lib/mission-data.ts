import {
  CauseItem,
  EvidenceItem,
  Stakeholder,
  UnexpectedEvent,
  Scenario,
  IssueOption,
  ChallengeEvent,
  ChallengeCategory,
} from "./definitions";

export interface MissionData {
  scenarioId: string;
  issues: string[]; // Options for Step 1
  issueOptions?: IssueOption[]; // Full structured options with isCorrect
  correctIssue?: string; // Designated correct issue text
  causes: CauseItem[]; // Step 2 items to rank
  evidenceLibrary: EvidenceItem[]; // Step 3 sources
  stakeholders: Stakeholder[]; // Step 4 interviewees
  unexpectedEvent: UnexpectedEvent; // Step 6 challenge (legacy / base)
  challenges: ChallengeEvent[]; // Step 6 3-category challenges (Stakeholder, Budget, Resource)
  stepTips: Record<number, string>; // Step 1-7 tips
}

export function getScenarioChallenges(scenario: Scenario): ChallengeEvent[] {
  if (scenario.missionData?.challenges && scenario.missionData.challenges.length > 0) {
    return scenario.missionData.challenges;
  }

  const title = scenario.title || "Community Project";
  const titleLower = title.toLowerCase();

  if (titleLower.includes("waste") || titleLower.includes("solid")) {
    return [
      {
        id: "challenge-stakeholder-waste",
        category: "stakeholder",
        categoryLabel: "Stakeholder Challenge",
        title: "Stakeholder Challenge: Key Mobilizers Reassigned",
        description:
          "The Barangay Chairman informed your group that the Barangay Tanods and volunteer zone leaders scheduled to co-lead the community assembly and zone clean-up drive have been reassigned to emergency disaster-preparedness duty. They cannot participate or provide on-ground manpower as planned.",
        affectedField: "stakeholders",
        editableFields: ["stakeholders"],
      },
      {
        id: "challenge-budget-waste",
        category: "budget",
        categoryLabel: "Budget Challenge",
        title: "Budget Challenge: Municipal Sanitation Subsidy Cut",
        description:
          "Due to municipal emergency calamity fund reallocations, the municipal government has cut barangay sanitation subsidies by 30%. Fuel and rental funding for heavy collection vehicles and sound equipment will be reduced next month. Your proposed budget is insufficient to cover all original expenses.",
        affectedField: "budget",
        editableFields: ["budget"],
      },
      {
        id: "challenge-resource-waste",
        category: "resource",
        categoryLabel: "Resource Challenge",
        title: "Resource Challenge: Clean-Up Materials & Bin Shortage",
        description:
          "The local hardware supplier and municipal warehouse notified your group that the color-coded waste bins, push-carts, and heavy-duty segregation bags requested for the community initiative are out of stock and cannot be delivered in time.",
        affectedField: "resources",
        editableFields: ["resources"],
      },
    ];
  }

  if (titleLower.includes("dengue")) {
    return [
      {
        id: "challenge-stakeholder-dengue",
        category: "stakeholder",
        categoryLabel: "Stakeholder Challenge",
        title: "Stakeholder Challenge: Health Worker Emergency Deployment",
        description:
          "The City Health Inspector and assigned Barangay Health Workers (BHWs) who were supposed to supervise the search-and-destroy mosquito inspection teams were called away to attend a high-level regional epidemiology emergency and cannot assist your team on the scheduled drive days.",
        affectedField: "stakeholders",
        editableFields: ["stakeholders"],
      },
      {
        id: "challenge-budget-dengue",
        category: "budget",
        categoryLabel: "Budget Challenge",
        title: "Budget Challenge: Health Outreach Budget Reduction",
        description:
          "The municipal health council had to reallocate funds toward an emergency influenza containment drive, resulting in a 30% budget cut for your anti-dengue community campaign materials, protective gear, and informational brochures.",
        affectedField: "budget",
        editableFields: ["budget"],
      },
      {
        id: "challenge-resource-dengue",
        category: "resource",
        categoryLabel: "Resource Challenge",
        title: "Resource Challenge: Larvicide & Fogging Equipment Shortage",
        description:
          "The City Health Office ran out of commercial larvicide granules and chemical fogging solutions due to regional supply shortages. An important material and facility resource needed for the activity is unavailable, requiring alternative methods.",
        affectedField: "resources",
        editableFields: ["resources"],
      },
    ];
  }

  if (titleLower.includes("rabies") || titleLower.includes("animal")) {
    return [
      {
        id: "challenge-stakeholder-rabies",
        category: "stakeholder",
        categoryLabel: "Stakeholder Challenge",
        title: "Stakeholder Challenge: Volunteer Veterinarian Unavailability",
        description:
          "The volunteer veterinarians from the partner animal welfare NGO who committed to assisting with the pet registration and vaccination drive had an emergency veterinary rescue operation in a neighboring province and can no longer participate.",
        affectedField: "stakeholders",
        editableFields: ["stakeholders"],
      },
      {
        id: "challenge-budget-rabies",
        category: "budget",
        categoryLabel: "Budget Challenge",
        title: "Budget Challenge: Animal Welfare Allocation Cut",
        description:
          "The local barangay council had to reduce the discretionary animal welfare fund by 35% due to seasonal flood repair costs, drastically reducing funds available for pet collars, vaccination record cards, and promotional flyers.",
        affectedField: "budget",
        editableFields: ["budget"],
      },
      {
        id: "challenge-resource-rabies",
        category: "resource",
        categoryLabel: "Resource Challenge",
        title: "Resource Challenge: Vaccine Cold-Chain Transport Delay",
        description:
          "Free vaccine cold-chain transport coolers and holding cages from the regional office have been delayed by 2 weeks. An important material or facility resource needed for the activity is unavailable.",
        affectedField: "resources",
        editableFields: ["resources"],
      },
    ];
  }

  // Generic fallback for any other scenario
  const customEvent = scenario.missionData?.unexpectedEvent;
  const customDesc = customEvent?.description?.trim();

  return [
    {
      id: "challenge-stakeholder-gen",
      category: "stakeholder",
      categoryLabel: "Stakeholder Challenge",
      title: "Stakeholder Challenge: Key Community Partner Unavailability",
      description:
        `A key stakeholder who was expected to assist in mobilizing ${title} is no longer available or cannot participate due to sudden conflicting official duties. You must adjust your partner network and stakeholder responsibilities to maintain community support.`,
      affectedField: "stakeholders",
      editableFields: ["stakeholders"],
    },
    {
      id: "challenge-budget-gen",
      category: "budget",
      categoryLabel: "Budget Challenge",
      title: "Budget Challenge: Funding Reallocation & Subsidy Reduction",
      description:
        customDesc && customDesc.toLowerCase().includes("budget")
          ? customDesc
          : `Due to emergency local council fund reallocations, available funding for ${title} has been cut by 30%. The proposed budget is insufficient to cover all originally projected expenses, requiring a revised budget allocation.`,
      affectedField: "budget",
      editableFields: ["budget"],
    },
    {
      id: "challenge-resource-gen",
      category: "resource",
      categoryLabel: "Resource Challenge",
      title: "Resource Challenge: Materials & Facility Shortage",
      description:
        customDesc && (customDesc.toLowerCase().includes("supply") || customDesc.toLowerCase().includes("delay") || customDesc.toLowerCase().includes("resource"))
          ? customDesc
          : `An important material, facility venue, or equipment resource essential for conducting the planned activities in ${title} is unavailable from the local supplier, requiring an adjustment of required resources.`,
      affectedField: "resources",
      editableFields: ["resources"],
    },
  ];
}

export function getMissionDataForScenario(scenario: Scenario): MissionData {
  const baseFallback = getGenericFallbackMissionData(scenario);

  // If scenario has custom database-stored missionData, return it directly
  if (scenario.missionData) {
    const rawIssues = scenario.missionData.issues || [];
    const normalizedIssueOptions: IssueOption[] = rawIssues.map((item, idx) => {
      if (typeof item === "string") {
        const isCorrect = scenario.missionData?.correctIssue
          ? scenario.missionData.correctIssue.trim().toLowerCase() === item.trim().toLowerCase()
          : idx === 0;
        return {
          id: `issue-${idx}`,
          text: item,
          isCorrect,
        };
      }
      return {
        id: item.id || `issue-${idx}`,
        text: item.text,
        isCorrect: Boolean(item.isCorrect),
      };
    });

    if (normalizedIssueOptions.length > 0 && !normalizedIssueOptions.some((o) => o.isCorrect)) {
      normalizedIssueOptions[0].isCorrect = true;
    }

    const issues = normalizedIssueOptions.length
      ? normalizedIssueOptions.map((o) => o.text)
      : baseFallback.issues;

    const correctIssue =
      normalizedIssueOptions.find((o) => o.isCorrect)?.text ||
      scenario.missionData.correctIssue ||
      issues[0] ||
      baseFallback.correctIssue;

    const hasCustomEvent =
      Boolean(scenario.missionData.unexpectedEvent?.title?.trim()) ||
      (scenario.missionData.unexpectedEvent?.options &&
        scenario.missionData.unexpectedEvent.options.length > 0);

    const hasCustomTips =
      scenario.missionData.stepTips &&
      Object.values(scenario.missionData.stepTips).some(
        (t) => typeof t === "string" && t.trim().length > 0
      );

    return {
      scenarioId: scenario.id,
      issues,
      issueOptions: normalizedIssueOptions.length ? normalizedIssueOptions : baseFallback.issueOptions,
      correctIssue,
      causes: scenario.missionData.causes?.length ? scenario.missionData.causes : baseFallback.causes,
      evidenceLibrary: scenario.missionData.evidenceLibrary?.length ? scenario.missionData.evidenceLibrary : baseFallback.evidenceLibrary,
      stakeholders: scenario.missionData.stakeholders?.length ? scenario.missionData.stakeholders : baseFallback.stakeholders,
      unexpectedEvent: hasCustomEvent && scenario.missionData.unexpectedEvent ? scenario.missionData.unexpectedEvent : baseFallback.unexpectedEvent,
      challenges: getScenarioChallenges(scenario),
      stepTips: hasCustomTips && scenario.missionData.stepTips ? scenario.missionData.stepTips : baseFallback.stepTips,
    };
  }

  // Fallback for new empty scenarios before admin customization
  return baseFallback;
}

export function getGenericFallbackMissionData(scenario: Scenario): MissionData {
  const fallbackIssues = [
    `${scenario.title}: Primary Systemic Issue`,
    "Lack of Community Participation & Engagement",
    "Inadequate Policy & Ordinance Enforcement",
    "Limited Resource Allocation & Funding",
  ];

  return {
    scenarioId: scenario.id,
    issues: fallbackIssues,
    correctIssue: fallbackIssues[0],
    issueOptions: fallbackIssues.map((text, idx) => ({
      id: `fallback-iss-${idx}`,
      text,
      isCorrect: idx === 0,
    })),
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
        isIrrelevant: false,
      },
      {
        id: "st3",
        name: "Coach Bryan Garcia",
        role: "Basketball League Coordinator",
        initialStatement: "Our summer league tournament schedule is already finalized. We are only concerned with reserving the covered court on weekends.",
        isIrrelevant: true,
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
    challenges: getScenarioChallenges(scenario),
    stepTips: {
      1: "Read carefully. Differentiate symptoms from root issues before prioritizing.",
      2: "Analyze cause relationships. Consider which factor triggers the others.",
      3: "You need to evaluate all the evidence in your library before proceeding. Combine official reports with community experiences.",
      4: "Gather diverse perspectives. Interview both local leaders and grassroots residents.",
      5: "Ensure your intervention plan is evidence-based, actionable, and sustainable.",
      6: "Anticipate real-world constraints. Adapt your strategy to overcome unexpected obstacles.",
      7: "Review the obstacles faced in the challenge simulation. Refine and adapt your community action plan to make it resilient, budget-aligned, and feasible.",
    },
  };
}
