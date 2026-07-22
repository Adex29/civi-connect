import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function evaluateStudentSubmission(
  scenarioTitle: string,
  scenarioDescription: string,
  constraints: string[],
  studentDraft: string
): Promise<{ passed: boolean; feedback: string; failedConstraints: string[] }> {
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Fallback if no API key is provided
    return {
      passed: true,
      feedback: "Development mode: AI evaluation skipped. Assuming passed.",
      failedConstraints: [],
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `
You are an expert evaluator assessing a student's civic action plan based on a given scenario and specific constraints.

Scenario Title: ${scenarioTitle}
Scenario Description: ${scenarioDescription}

Constraints that MUST be met:
${constraints.map(c => `- ${c}`).join('\n')}

Student's Draft Plan:
"""
${studentDraft}
"""

Evaluate if the student's draft meets ALL the constraints. Be lenient but ensure the core requirements of each constraint are addressed.

Respond strictly in the following JSON format:
{
  "passed": boolean (true if all constraints are reasonably met, false otherwise),
  "feedback": "string (Constructive feedback explaining what was good and what needs improvement. Address the student directly.)",
  "failedConstraints": ["array of strings (the specific constraints from the list that were not met, if any)"]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON block in case there's markdown formatting or extra text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : responseText;

    const parsed = JSON.parse(jsonString);
    return {
      passed: parsed.passed,
      feedback: parsed.feedback,
      failedConstraints: parsed.failedConstraints || [],
    };
  } catch (error) {
    console.error("AI Evaluation Error:", error);
    return {
      passed: false,
      // feedback: "There was an error evaluating your submission. Please try again later or contact your administrator.",
      feedback: `AI Error: ${error instanceof Error ? error.message : String(error)}`,
      failedConstraints: [],
    };
  }
}
