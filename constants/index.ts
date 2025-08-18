export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];
export const AdvancedAIResponse = `{
"summary":"",
  "overallScore": 0,
  "ATS": {
    "score": 0,
    "tips": [
      { "type": "good", "tip": "", "explanation": "" },
      { "type": "improve", "tip": "", "explanation": "" }
    ]
  },
  "toneAndStyle": {
    "score": 0,
    "tips": []
  },
  "content": {
    "score": 0,
    "tips": []
  },
  "structure": {
    "score": 0,
    "tips": []
  },
  "skills": {
    "score": 0,
    "tips": []
  },
  "missingthings": {
    "score": 0,
    "tips": []
  },
  "strongPoints": {
    "score": 0,
    "tips": []
  },
  "weakAreas": {
    "score": 0,
    "tips": []
  },
  "hiringChances": {
    "score": 0,
    "tips": []
  },
  "rejectionChances": {
    "score": 0,
    "tips": []
  },
    "suggestions": {
    "tips": []
  },
}
`
export const AdvancedAIPrompt = ({jobTitle, jobDescription, file}: {
    jobTitle: string;
    jobDescription: string;
    file: File
}) => `You are an ATS (Applicant Tracking System) + Resume Analyzer.  
Your task: Compare a candidate's **resume** from file ${file} against a given **job title** ${jobTitle} **job description** ${jobDescription} and generate structured evaluation results.  

⚡ OUTPUT FORMAT:  
Return the result **only as valid JSON** (no markdown, no explanations, no code fences).  

JSON Schema:
{
  "overallScore": number,  
  "ATS": {
    "score": number,
    "tips": [ { "type": "good"|"improve", "tip": string, "explanation": string } ]
  },
  "toneAndStyle": {
    "score": number,
    "tips": [ { "type": "good"|"improve", "tip": string, "explanation": string } ]
  },
  "content": {
    "score": number,
    "tips": [ { "type": "good"|"improve", "tip": string, "explanation": string } ]
  },
  "structure": {
    "score": number,
    "tips": [ { "type": "good"|"improve", "tip": string, "explanation": string } ]
  },
  "skills": {
    "score": number,
    "tips": [ { "type": "good"|"improve", "tip": string, "explanation": string } ]
  },
  "missingthings": {
    "score": number,
    "tips": [ { "type": "improve", "tip": string, "explanation": string } ]
  },
  "strongPoints": {
    "score": number,
    "tips": [ { "type": "good", "tip": string, "explanation": string } ]
  },
  "weakAreas": {
    "score": number,
    "tips": [ { "type": "improve", "tip": string, "explanation": string } ]
  },
  "hiringChances": {
    "score": 0,
    "tips": []
  },
  "rejectionChances": {
    "score": 0,
    "tips": []
  }, 
  "suggestions": {
    "tips": []
  },
  "summary":"",
}

Rules:
- Always return **well-formed JSON** that strictly follows the schema above.  
- Do NOT wrap in markdown, code blocks, or extra text.  
- Each "tips" list should have at least 3 items if possible.  
- Scores are integers between 0–100.  
`

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

export const prepareInstructions = ({jobTitle, jobDescription}: { jobTitle: string; jobDescription: string; }) =>
    `You are an expert in ATS (Applicant Tracking System) and resume analysis.
      Please analyze and rate this resume and suggest how to improve it.
      The rating can be low if the resume is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
      If available, use the job description for the job user is applying to to give more detailed feedback.
      If provided, take the job description into consideration.
      The job title is: ${jobTitle}
      The job description is: ${jobDescription}
      Provide the feedback using the following format:
      ${AIResponseFormat}
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;