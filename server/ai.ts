import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Standard lazy initialization of Google GenAI SDK as outlined in guidelines
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

/**
 * AI Matching Engine: Computes a compatibility match score (0-100), logical reasons,
 * and a personalized starter introduction message between two ecosystem members.
 */
export async function computeAiMatch(
  userA: any,
  profileA: any,
  userB: any,
  profileB: any,
  matchType: string
): Promise<{ score: number; reasons: string[]; recommended_intro_message: string }> {
  const client = getAiClient();

  const prompt = `
    Given the following details of two stakeholders in the startup ecosystem:
    
    PERSON A:
    - Name: ${userA.full_name}
    - Role Type: ${userA.role}
    - Bio: ${userA.bio || 'None'}
    - Location: ${userA.city || ''}, ${userA.state || ''}
    - Profile Data: ${JSON.stringify(profileA || {})}

    PERSON B:
    - Name: ${userB.full_name}
    - Role Type: ${userB.role}
    - Bio: ${userB.bio || 'None'}
    - Location: ${userB.city || ''}, ${userB.state || ''}
    - Profile Data: ${JSON.stringify(profileB || {})}

    Evaluate their compatibility for a '${matchType}' connection (e.g. founder connecting to investor, founder connecting to a expert mentor, or cofounder matching).
    Provide a compatibility score out of 100, exactly 3 distinct bullet points explaining the strategic reasons for the match, and a customized, friendly email-style introduction starter message (approx 2-3 sentences) written from Person A to Person B.

    Return the result in JSON matching this schema:
    {
      "score": <number between 50 and 99>,
      "reasons": [<string>, <string>, <string>],
      "recommended_intro_message": <string>
    }
  `;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              reasons: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommended_intro_message: { type: Type.STRING }
            },
            required: ["score", "reasons", "recommended_intro_message"]
          }
        }
      });

      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (e) {
      console.warn("Gemini call failed, utilizing heuristic fallback:", e);
    }
  }

  // Polished heuristic intelligence fallback
  return runHeuristicMatch(userA, profileA, userB, profileB, matchType);
}

/**
 * AI Professional Bio Generator from key fields
 */
export async function generateProfileBio(payload: {
  role: string;
  skills: string[];
  company?: string;
  goals: string;
}): Promise<string> {
  const client = getAiClient();
  const { role, skills, company, goals } = payload;

  const prompt = `
    Write a highly professional, first-person bio paragraph (3 to 4 sentences max) for a startup platform profile.
    - Role: ${role}
    - Technical skills / expertise areas: ${skills.join(", ")}
    - Company / Institution affiliation: ${company || 'None'}
    - Professional Goals/Objectives: ${goals}
    
    Make it active, inspiring, and tailored to the Indian start-up ecosystem. Do not include any greeting lines or metadata, return ONLY the paragraph.
  `;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      return response.text?.trim() || "";
    } catch (e) {
      console.warn("Bio generation call failed, utilizing local formatter:", e);
    }
  }

  // Heuristic humanized generator
  const comp = company ? ` at ${company}` : "";
  const skillsStr = skills.length > 0 ? `, specializing in ${skills.slice(0, 3).join(", ")}` : "";
  const goalsLower = (goals || "").toLowerCase();
  return `I am an active ${role}${comp}${skillsStr}. My primary focus is to ${goalsLower}, and I am keen to connect with other ecosystem leaders, mentors, and investors across Noida, Hyderabad, and wider Telangana to co-create sustainable solutions.`;
}

/**
 * AI interpret search queries (vague to structured filters)
 */
export async function interpretVagueSearch(query: string): Promise<{
  role?: string;
  industry?: string;
  city?: string;
  stage?: string;
  clean_term?: string;
}> {
  const client = getAiClient();

  const prompt = `
    Analyze this natural language search query from a business/startup catalog website:
    "${query}"

    Extract if the user is looking for a specific stakeholder role (such as 'investor', 'mentor', 'startup_founder', 'job_seeker'), a specific industry (SaaS, FinTech, DeepTech, AgTech, HealthTech, EV), a city (Hyderabad, Warangal, Khammam, Karimnagar), or a startup funding stage (seed, series-a, idea).
    Also provide a clean singular searchTerm or keyword.

    Return the answer in JSON format schema:
    {
      "role": <string or null>,
      "industry": <string or null>,
      "city": <string or null>,
      "stage": <string or null>,
      "clean_term": <string or null>
    }
  `;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              industry: { type: Type.STRING },
              city: { type: Type.STRING },
              stage: { type: Type.STRING },
              clean_term: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.warn("Vague search interpretation failed:", e);
    }
  }

  // Local fallback parser
  const qLower = (query || "").toLowerCase();
  const result: any = { clean_term: query || "" };
  if (qLower.includes("investor") || qLower.includes("funding") || qLower.includes("vc")) {
    result.role = "investor";
  } else if (qLower.includes("mentor") || qLower.includes("expert") || qLower.includes("advisor")) {
    result.role = "mentor";
  } else if (qLower.includes("founder") || qLower.includes("startup") || qLower.includes("entrepreneur")) {
    result.role = "startup_founder";
  } else if (qLower.includes("job") || qLower.includes("work") || qLower.includes("hire") || qLower.includes("developer")) {
    result.role = "job_seeker";
  }

  if (qLower.includes("space") || qLower.includes("rocket") || qLower.includes("aerospace")) {
    result.industry = "Aerospace";
  } else if (qLower.includes("crop") || qLower.includes("farm") || qLower.includes("agri")) {
    result.industry = "AgTech";
  } else if (qLower.includes("electric") || qLower.includes("ev") || qLower.includes("delivery")) {
    result.industry = "EV";
  }

  if (qLower.includes("warangal")) result.city = "Warangal";
  if (qLower.includes("hyderabad")) result.city = "Hyderabad";
  if (qLower.includes("khammam")) result.city = "Khammam";

  return result;
}

/**
 * Heuristic match scoring processor if API Key is empty
 */
function runHeuristicMatch(userA: any, profileA: any, userB: any, profileB: any, matchType: string) {
  let score = 75;
  const reasons: string[] = [];

  // Match roles compatibility
  if (userA.role === "startup_founder" && userB.role === "investor") {
    score += 12;
    reasons.push("Substantial alignment between investor funding capabilities and founder capital requirements");
  } else if (userA.role === "startup_founder" && userB.role === "mentor") {
    score += 10;
    reasons.push("Strategic match between your business scaling stage and their coaching experience");
  } else if (userA.role === "job_seeker" && userB.role === "startup_founder") {
    score += 14;
    reasons.push("Start-up founder is looking for dynamic engineers; matches candidate's skill tree keywords");
  }

  // Industry overlap
  const indA = profileA?.industry || [];
  const indB = profileB?.sectors_of_interest || profileB?.industries || profileB?.industry || [];
  const overlap = indA.filter((i: string) => indB.includes(i));
  if (overlap.length > 0) {
    score += 8;
    reasons.push(`Direct shared domain interest in [${overlap.join(", ")}] industry verticals`);
  } else {
    reasons.push("Dynamic ecosystem adjacency offering dual growth potentials");
  }

  // Location affinity
  if (userA.city && userB.city && userA.city.toLowerCase() === userB.city.toLowerCase()) {
    score += 5;
    reasons.push(`Highly accessible local connection - both situated in ${userA.city}`);
  } else {
    reasons.push("Inter-district Telangana network promoting distributed startup density");
  }

  // Cap score safely between 50 and 97
  score = Math.min(Math.max(score, 50), 97);

  // Pad to exactly 3 bullet reasons
  while (reasons.length < 3) {
    reasons.push("Aligned with the foundational non-profit expansion goals of the TG10X platform");
  }

  const intro = `Hi ${userB.full_name}, I was exploring the TG10X directory and noticed our strong synergies in ${overlap[0] || 'the technology space'}. I would love to connect to discuss potential collaboration opportunities in our upcoming programs. Cheers!`;

  return {
    score,
    reasons: reasons.slice(0, 3),
    recommended_intro_message: intro
  };
}
