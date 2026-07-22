const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const scenariosPath = path.join(process.cwd(), 'data', 'scenarios.json');

const scenarios = [
  {
    id: nanoid(),
    title: "Barangay Solid Waste Management Crisis",
    description: "Your barangay has been experiencing severe localized flooding during the rainy season. The Barangay Council discovered that the primary cause is the heavy accumulation of single-use plastics and household garbage in the local esteros (creeks) and drainage canals. The community lacks discipline in segregating waste, and garbage trucks often fail to collect on time due to narrow streets.",
    context: "Solid waste management is a persistent issue at the barangay level under R.A. 9003 (Ecological Solid Waste Management Act of 2000). The barangay is mandated to handle the collection of biodegradable and recyclable wastes, while the city/municipality handles residual wastes.",
    constraints: [
      "Propose an information campaign that targets households to practice proper waste segregation at the source.",
      "Design a low-cost, community-led monitoring system to prevent illegal dumping of garbage in the esteros.",
      "Outline a logistical plan for waste collection that accommodates the narrow streets of the barangay."
    ],
    status: "active",
    createdBy: "admin-1",
    createdAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    title: "Dengue Outbreak Prevention",
    description: "During the onset of the rainy season, the local health center reported a significant spike in Dengue fever cases within your barangay, particularly affecting children. Health workers identified multiple empty lots and neglected areas acting as breeding grounds for mosquitoes due to stagnant water.",
    context: "Barangays play a crucial role in preventative healthcare. The DOH advocates the '4S Strategy' against Dengue: Search and destroy mosquito-breeding sites, Self-protection measures, Seek early consultation, and Support fogging/spraying only in hotspot areas.",
    constraints: [
      "Formulate a community-wide 'Search and Destroy' clean-up drive schedule involving local youth (SK) and community volunteers.",
      "Create a strategy to compel owners of abandoned or empty lots to clear their properties of stagnant water.",
      "Propose an educational initiative to teach children and parents about self-protection measures using locally available resources."
    ],
    status: "active",
    createdBy: "admin-1",
    createdAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    title: "Stray Animal Population and Rabies Threat",
    description: "There has been an alarming increase in the number of stray dogs and cats roaming the barangay streets. Several residents, including a young student, were recently bitten by a stray dog. The barangay currently has no local animal pound and limited funds for mass vaccination.",
    context: "The Anti-Rabies Act of 2007 (R.A. 9482) requires LGUs to control stray animals, while barangays are tasked with assisting in the registration and vaccination of dogs, as well as conducting information campaigns on responsible pet ownership.",
    constraints: [
      "Develop a campaign promoting responsible pet ownership, specifically targeting the registration and confinement of pets within household premises.",
      "Propose a partnership or collaboration strategy with local NGOs or the City Veterinary Office to conduct a low-cost mass anti-rabies vaccination drive.",
      "Design a humane reporting and response system for aggressive stray animals within the barangay."
    ],
    status: "active",
    createdBy: "admin-1",
    createdAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    title: "Youth Engagement and Curfew Implementation",
    description: "The Barangay Tanods have reported an increase in incidents involving youth loitering late at night, leading to noise complaints, vandalism, and minor altercations. The Sangguniang Kabataan (SK) has a budget but struggles to create programs that genuinely interest the local youth.",
    context: "Under the Local Government Code, the barangay enforces local ordinances including curfews for minors, while the SK is mandated to promulgate resolutions necessary to carry out programs for youth development.",
    constraints: [
      "Design an engaging, non-traditional recreational or skill-building program funded by the SK to keep the youth productive during evenings or weekends.",
      "Propose a restorative justice approach (rather than punitive) for first-time curfew violators apprehended by the Barangay Tanods.",
      "Create a communication plan to inform parents of their responsibilities regarding the barangay curfew ordinance."
    ],
    status: "active",
    createdBy: "admin-1",
    createdAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    title: "Barangay Disaster Risk Reduction (BDRRM) Preparedness",
    description: "Your barangay is situated near a river and is highly susceptible to flooding during typhoons. However, the community lacks a clear early warning system, and residents often refuse to evacuate until the floodwaters have already reached dangerous levels.",
    context: "R.A. 10121 (Philippine Disaster Risk Reduction and Management Act) requires every barangay to have a functioning BDRRM Committee and an updated community-based disaster risk reduction and management plan.",
    constraints: [
      "Design a localized, easy-to-understand Early Warning System (EWS) that can reach all residents, including those without smartphones or internet access.",
      "Formulate a plan to organize and train a community-based volunteer rescue and relief team.",
      "Propose an intervention strategy to convince hesitant residents to undergo pre-emptive evacuation before a typhoon strikes."
    ],
    status: "active",
    createdBy: "admin-1",
    createdAt: new Date().toISOString()
  }
];

// Read existing
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(scenariosPath, 'utf8'));
} catch (e) {
  existing = [];
}

// Append or replace? Let's just replace if empty, or append if not.
const updated = [...existing, ...scenarios];

fs.writeFileSync(scenariosPath, JSON.stringify(updated, null, 2));
console.log('Successfully seeded 5 Philippine Barangay-level scenarios into data/scenarios.json');
