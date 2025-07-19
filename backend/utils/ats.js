const { GoogleGenAI, Type } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function extractWeights(jd) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Job Description: ${jd}`,
    config: {
      systemInstruction: `
      Act as an expert Applicant Tracking System (ATS) and analyze the following Job Description (JD). Based on the recruiter's intent, assign relative importance weights (summing to 1) to the following resume sections:
      1. Technical Skills
      2. Soft Skills
      3. Projects
      4. Domain Work Experience
      5. Certifications
      6. Education
      Your goal is to guide applicants on how to tailor their resumes by showing which sections are most important for this job.`,

      temperature: 0.0,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          techinal_skills: {
            type: Type.NUMBER
          },
          soft_skills: {
            type: Type.NUMBER
          },
          projects: {
            type: Type.NUMBER
          },
          domain_experience: {
            type: Type.NUMBER
          },
          certificates: {
            type: Type.NUMBER
          },
          education: {
            type: Type.NUMBER
          }
        }
      }
    }
  });

  return response.text
}


async function buildResume(jd, profile, weight) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    1. Job Description: ${jd}
    2. Relative Section Weights: ${weight}
    3. Applicant Profile: ${profile}
    `,
    config: {
      systemInstruction: `
    You are an expert resume optimization engine. Below is:
    1. A Job Description (JD)
    2. The relative importance weights (summing to 1) for each resume section given by experts
    3. The applicant's complete profile
    Objective: Identify what information should be included under each section of the resume to maximize match with the JD while following these strict rules:
    1.Do not fabricate any information not provided by the user.
    2.You may rephrase or generalize synonyms (e.g., convert “AWS” into “Cloud Services” or vice versa) to improve alignment, but only if accurate.
    3.Structure the resume to prioritize the weighted sections, using the weights to determine length and placement.
    4.Use strong, clear, and concise resume language with bullets where appropriate.
    5.Do not invent projects, companies, education, or skills that are not present in the user profile.
Output the result in the following structured JSON format (responseSchema below) Keep any sections blank if nothing fits there.
Under the skills section in the output segregate the identifed skills to be put in rsume into subsections(e.g.: softskills, techinal_skills, programming_languages, etc) and give the subsection name and all the skills under that subsection. Do not make unnecessary subsections. make maximum 5 subsections include the skills withing thme only.
Do not return section weights under match_scores. Instead, assign a real alignment score (0-100) for each resume section based on the Job Description and Profile match. Then compute a weighted average using the section weights to form overall_ats_match_score.
    `,
      temperature: 0.0,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overall_ats_match_score: {
            type: Type.NUMBER
          },
          match_scores: {
            type: Type.OBJECT,
            properties: {
              technical_skills_match_score: { type: Type.NUMBER },
              soft_skills_match_score: { type: Type.NUMBER },
              projects_match_score: { type: Type.NUMBER },
              domain_experience_match_score: { type: Type.NUMBER },
              certificates_match_score: { type: Type.NUMBER },
              education_match_score: { type: Type.NUMBER }
            }
          },
          missing_keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subsection_name: { type: Type.STRING },
                subsections_skills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            }
          },
          domain_experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                duration: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING },
                institution: { type: Type.STRING },
                percentage_point: { type: Type.NUMBER },
                duration: { type: Type.STRING }
              }
            }
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                about: { type: Type.STRING },
                techstack: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                feature: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                link: { type: Type.STRING }
              }
            }
          },
          certifications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                institution: { type: Type.STRING },
                description: { type: Type.STRING },
                link: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return response.text
}


async function optimizeResume(jd, profile, weights, resume) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: `
  1. Job Description: ${jd}
  2. Applicant Resume: ${resume}
  3. Applicant Profile: ${profile}
  4. Relative Section Weights: ${weights}
`,
    config: {
      temperature: 0.0,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ats_match_score: { type: Type.NUMBER },
          section_wise_scores: {
            type: Type.OBJECT,
            properties: {
              technical_skills: { type: Type.NUMBER },
              soft_skills: { type: Type.NUMBER },
              projects: { type: Type.NUMBER },
              domain_experience: { type: Type.NUMBER },
              certifications: { type: Type.NUMBER },
              education: { type: Type.NUMBER }
            }
          },
          missing_keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          latex_resume: { type: Type.STRING }
        }
      },
      systemInstruction: `
You are an expert resume optimization engine.

You will be provided:
1. A Job Description (JD)
2. An applicant resume (original, raw text format)
3. Strucutured profile of the applicant
4. The relative importance weights (summing to 1) for each resume section given by experts

Your task is to optimize the user's resume based on the given Job Description (JD) and Applicant Profile. Follow the instructions below precisely:
Objective-
Rewrite the resume to maximize relevance and alignment with the Job Description, ensuring it is ATS-friendly, concise, and well-formatted.

Optimization Rules-
- DO NOT fabricate any experience, skill, certification, tool, or project that is not explicitly mentioned in either the original resume or user profile.
- Preserve all meaningful and relevant content:
1.If a section (like a project or experience) is relevant to the JD, it must be retained — even if it needs to be rewritten using different keywords.
2.Only remove content that is not aligned with the job role or domain, and that adds little or no value in this context.
- Use the following sources for information:
1.The original resume
2.The user's extended profile (which may contain additional but unused relevant content)

What to Modify and How
1.Where a term in the resume and the JD mean the same thing (e.g., “Cloud Platforms” vs. “AWS”), rewrite using the term from the JD.
2.Replace generic terms with specific JD keywords where applicable (e.g., change “performance optimization” to “system performance optimization” if that matches the JD).
3.Reorder sections to reflect the importance weights provided (e.g., Technical Skills first if its weight is highest, then Experience, then Projects, etc.).
4.Include any relevant skills, tools, or achievements found in the user profile but missing in the original resume.
Example: If the profile lists “SAP S/4HANA” or “SAP BTP”, and the JD requires it, include it if the context fits.
If the profile includes “Agile” but the resume only says “Scrum”, include both where appropriate.

What to Remove
Any content not relevant to the job description (e.g., a project using unrelated tech if it doesn't demonstrate transferable skills).
Repetitive points or vague phrases that don't contribute to ATS or human readability.

Formatting
Use clean headings, bullet points, and concise phrasing.
Ensure it is ATS-parsable (avoid tables, graphics, or non-standard formatting).
Maintain consistent tense, punctuation, and capitalization.

Format of Response (IMPORTANT):
- Return output as valid JSON.
- In the latex_resume field, embed the LaTeX code inside a raw triple backtick block (like in Markdown).
- Do NOT escape LaTeX characters. Do NOT return LaTeX as a one-liner string with \\n. Use actual line breaks inside the triple backticks.
- Make the latex document very much ats friendly and well formatted liek a very good resume.
- In the resume either give a very short objective or about section or dont give.
- In the resume also inlcude the links you got with giving titles like visit or see.


Final Note
DO NOT Invent any new information.
DO NOT Include speculative or unverifiable content.
DO NOT Skip valuable sections already present in the resume/profile.
Output the resume in latex format

Strictly follow the output schema. In the section wise scores return (out of 100) how much the generated resume matches with the job description. Also give all the missing keywords in the resume.
    `
    }
  });

  return response.text
}

// extractWeights();

// buildResume();

// optimizeResume();

module.exports = {
  extractWeights,
  buildResume,
  optimizeResume
}