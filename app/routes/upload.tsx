import React, {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import {FileUploader} from "~/components/FileUploader";
import {convertPdfToImage} from "~/lib/pdf2img";
import {useNavigate} from "react-router";
import {useAxiosCrud} from "~/hooks/useAxios";
import {API_URL} from "~/constants";
import {type GenerateContentResponse, GoogleGenAI} from "@google/genai";
import {AdvancedAIPrompt} from "../../constants";
import * as process from "node:process";

const Upload = () => {
    const {create, update, data} = useAxiosCrud(API_URL + "/resumesUpload");
    const {create: uploadResumeFeedback} = useAxiosCrud(API_URL + "/resumeFeedback", false);
    const navigate = useNavigate();
    const [genData, setGenData] = useState("")
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState<string>("Processing...");
    const [file, setFile] = useState<File | null>(null);
    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});


    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}: {
        companyName: string,
        jobTitle: string,
        jobDescription: string,
        file: File
    }): Promise<void> => {
        try {
            setStatusText('Uploading the pdf file...');
            setIsProcessing(true);
            console.log('file', file)
            const imageFile = await convertPdfToImage(file);
            if (!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');
            setStatusText('Uploading the image...');
            const formData = new FormData();
            formData.append("resume", file);        // 👈 file
            formData.append("jobTitle", jobTitle);
            formData.append("jobDescription", jobDescription);
            formData.append("jobCompany", companyName);
            formData.append("aboutJobCompany", "");
            formData.append("experience", "4");
            formData.append("resumeImage", imageFile.file)// 👈 file
            const uploadedResponse = await create(formData, {headers: {"Content-Type": "multipart/form-data",}})
            console.log('uploadedResponse', uploadedResponse)
            setStatusText('Resume Uploaded, now analyzing...');

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: AdvancedAIPrompt({jobTitle, jobDescription, file}),
            });
            console.log('response', response.text);
            const data = response.candidates?.[0].content?.parts?.[0]?.text || ""
            setGenData(JSON.parse(data));

            // Step 1: remove ```json ... ```
            const cleaned = data.replace(/```json|```/g, '').trim();

            // Step 2:* parse JSON
            let feedbackRes;
            try {
                feedbackRes = JSON.parse(cleaned);
                console.log("Parsed JSON:", feedbackRes);
            } catch (err) {
                console.error("Failed to parse JSON:", err);
            }
            // const feedbackRes = {
            //     "resume": "68a344730667105652ba865e",
            //     "feedback": {
            //         "overallScore": 68,
            //         "ATS": {
            //             "score": 75,
            //             "tips": [
            //                 {
            //                     "type": "good",
            //                     "tip": "Strong match for core Front End technologies.",
            //                     "explanation": "Your resume likely includes keywords like 'JavaScript', 'Typescript', 'React', 'HTML', 'CSS', 'web applications', 'unit testing', and 'REST', which are highly sought after by the ATS for this role."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Incorporate AI-related keywords.",
            //                     "explanation": "The job description heavily emphasizes 'AI', 'AI-native', 'integrating AI', 'AI solutions', 'AI concepts', and 'AI Native principles'. Ensure these terms, or close synonyms, are present in your resume, especially in your summary, experience, or a dedicated skills section."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Add specific SDLC and design pattern terms.",
            //                     "explanation": "Explicitly mentioning 'Software Development Life Cycle (SDLC)' familiarity, 'Software design/architecture process', 'design patterns', and 'CI/CD' best practices will help the ATS identify a stronger match to the 'Qualifications' and 'Responsibilities' sections."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Quantify achievements with relevant metrics.",
            //                     "explanation": "While likely good, ensure that where possible, you include numbers, percentages, and monetary values to quantify the impact of your work (e.g., 'improved page load time by X%', 'reduced bugs by Y%'), which helps ATS systems prioritize candidates demonstrating clear results."
            //                 }
            //             ]
            //         },
            //         "toneAndStyle": {
            //             "score": 88,
            //             "tips": [
            //                 {
            //                     "type": "good",
            //                     "tip": "Use strong action verbs.",
            //                     "explanation": "Assuming your resume uses verbs like 'developed', 'designed', 'implemented', 'mentored', and 'architected', it effectively communicates your contributions and leadership."
            //                 },
            //                 {
            //                     "type": "good",
            //                     "tip": "Maintain a professional and concise tone.",
            //                     "explanation": "The resume likely avoids jargon where possible, presenting information clearly and succinctly, which is ideal for a senior-level position."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Align language with 'builder' and 'innovator' mindset.",
            //                     "explanation": "The JD emphasizes 'innovators, risk-takers, and imaginative thinkers' with a 'builder' mindset. Consider incorporating language that reflects these qualities, perhaps in a professional summary or by describing projects where you 'pioneered', 'iterated', or 'experimented' with new solutions."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Showcase problem-solving creativity.",
            //                     "explanation": "The JD looks for 'strong problem-solving skills and ability to think creatively about AI solutions'. While your resume likely highlights problem-solving, ensure it explicitly conveys creativity and out-of-the-box thinking."
            //                 }
            //             ]
            //         },
            //         "content": {
            //             "score": 72,
            //             "tips": [
            //                 {
            //                     "type": "good",
            //                     "tip": "Highlight Senior Front End experience.",
            //                     "explanation": "Your resume effectively demonstrates 5+ years of professional experience developing web applications with a focus on core Front End technologies, matching a key qualification."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Integrate AI-specific projects or learning.",
            //                     "explanation": "The JD places significant emphasis on AI. If you have any experience, even limited (e.g., integrating an AI API, contributing to an AI-driven feature, or personal projects with AI), make sure to prominently feature it. If not, consider a 'Key Skills' or 'Interests' section that highlights your foundational understanding or ongoing learning in AI."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Emphasize technical leadership and mentoring.",
            //                     "explanation": "The role involves being a 'technical leader by mentoring junior engineers'. Ensure your resume explicitly details instances where you mentored, led technical initiatives, or guided junior team members."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Detail experience with mockups, wireframes, and PoC code.",
            //                     "explanation": "The 'Responsibilities' include 'quickly translate insights into mockups, wireframes, and working proof-of-concept code'. Make sure your project descriptions or a dedicated skills section showcase this aspect of your front-end development process."
            //                 }
            //             ]
            //         },
            //         "structure": {
            //             "score": 90,
            //             "tips": [
            //                 {
            //                     "type": "good",
            //                     "tip": "Clear and logical sectioning.",
            //                     "explanation": "Your resume likely uses standard sections like 'Summary/Objective', 'Experience', 'Education', and 'Skills', making it easy to navigate and digest information quickly."
            //                 },
            //                 {
            //                     "type": "good",
            //                     "tip": "Consistent formatting and readability.",
            //                     "explanation": "Professional fonts, consistent bullet points, and appropriate white space contribute to a highly readable document, ensuring recruiters can quickly find key information."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Consider a 'Technical Skills' section with proficiency levels.",
            //                     "explanation": "While your skills are likely embedded, a distinct section that lists technologies and potentially indicates your proficiency (e.g., 'Expert', 'Proficient', 'Familiar') can be very helpful for ATS and human readers alike, especially for the diverse tech stack required."
            //                 }
            //             ]
            //         },
            //         "skills": {
            //             "score": 70,
            //             "tips": [
            //                 {
            //                     "type": "good",
            //                     "tip": "Excellent proficiency in core Front End technologies.",
            //                     "explanation": "Your resume demonstrates strong skills in JavaScript, Typescript, React, HTML, and CSS, which are essential for this role."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Demonstrate foundational understanding of AI concepts.",
            //                     "explanation": "The JD clearly states 'Possess basic understanding of AI concepts and foundations'. This is a critical gap if not explicitly addressed. Even familiarity with terms like 'Machine Learning', 'Natural Language Processing', or 'Data Science' can be beneficial."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Showcase ability to work with AI experts and integrate AI.",
            //                     "explanation": "The JD looks for 'Ability to work collaboratively with AI experts and integrate AI into existing systems as needed, with guidance'. Highlight any cross-functional collaboration experiences, even if not AI-specific, and express your readiness to learn and apply AI integration."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Mention familiarity with data/metrics for AI models.",
            //                     "explanation": "If applicable, include any experience or knowledge related to data collection, processing, or evaluation that could be relevant for building or evaluating AI models."
            //                 }
            //             ]
            //         },
            //         "missingthings": {
            //             "score": 40,
            //             "tips": [
            //                 {
            //                     "type": "improve",
            //                     "tip": "Lack of explicit AI-related experience or interest.",
            //                     "explanation": "The most significant missing element is direct experience or strong expressed interest in AI concepts, AI integration, or AI-native principles, which are heavily emphasized throughout the job description."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Limited demonstration of 'builder' mindset in an AI context.",
            //                     "explanation": "While your resume might show a builder mindset generally, it likely doesn't connect this specifically to integrating AI and emerging technologies to solve customer problems efficiently."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Absence of specific examples for leading technical design/architecture in complex scenarios.",
            //                     "explanation": "While likely a senior, specific examples of leading the design/architecture process, especially in large-scale, consumer-facing applications, could be more prominent."
            //                 }
            //             ]
            //         },
            //         "strongPoints": {
            //             "score": 85,
            //             "tips": [
            //                 {
            //                     "type": "good",
            //                     "tip": "Extensive experience in Front End development.",
            //                     "explanation": "Your resume clearly demonstrates strong, relevant professional experience, likely exceeding the 5+ years requirement for Front End web application development."
            //                 },
            //                 {
            //                     "type": "good",
            //                     "tip": "Solid grasp of modern Front End technologies.",
            //                     "explanation": "Proficiency in JavaScript, Typescript, React, HTML, and CSS positions you well for the technical demands of the role."
            //                 },
            //                 {
            //                     "type": "good",
            //                     "tip": "Experience with large-scale, consumer-facing applications.",
            //                     "explanation": "This specific requirement is met, showing your capability to work on the kind of platforms Intuit develops."
            //                 },
            //                 {
            //                     "type": "good",
            //                     "tip": "Demonstrated technical leadership capabilities.",
            //                     "explanation": "Your resume likely reflects experience mentoring junior engineers and taking ownership of technical aspects, aligning with the 'technical leader' responsibility."
            //                 }
            //             ]
            //         },
            //         "weakAreas": {
            //             "score": 55,
            //             "tips": [
            //                 {
            //                     "type": "improve",
            //                     "tip": "Lack of explicit AI skills and experience.",
            //                     "explanation": "This is the most critical area. The job description heavily leans into AI, and a lack of specific mentions of AI concepts, integration, or related projects will be a significant drawback."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Insufficient demonstration of adapting to emerging technologies (specifically AI).",
            //                     "explanation": "The JD stresses constant identification of 'cutting-edge technology and design paradigms', especially AI. Your resume might not sufficiently highlight your proactiveness in this area beyond core FE tech."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Limited evidence of proposing or creatively solving problems with AI.",
            //                     "explanation": "The JD seeks candidates who can 'Propose AI solutions that can be applied to a variety of problems' and think 'creatively about AI solutions'. This specific aspect needs to be addressed."
            //                 }
            //             ]
            //         },
            //         "rejectionChances": {
            //             "score": 40,
            //             "tips": [
            //                 {
            //                     "type": "improve",
            //                     "tip": "Address the AI gap immediately.",
            //                     "explanation": "Without significant tailoring to address the strong AI focus in the job description, your resume may be overlooked by the ATS or recruiters who are specifically screening for AI experience/interest. This is the biggest hurdle."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Customize your summary/objective.",
            //                     "explanation": "Tailor your professional summary or objective to directly align with Intuit's 'AI-native' culture and your interest in integrating AI into financial management solutions, even if your direct experience is limited."
            //                 },
            //                 {
            //                     "type": "improve",
            //                     "tip": "Seek opportunities to gain AI exposure.",
            //                     "explanation": "If truly lacking in AI experience, consider online courses, personal projects, or open-source contributions that allow you to gain and then showcase basic AI understanding and integration skills to strengthen your candidacy for future roles."
            //                 }
            //             ]
            //         }
            //     },
            //     "overallScore": 68
            // }

            setStatusText("Storing resume feedback... ")
            const resumeFeedback = await uploadResumeFeedback({
                resume: uploadedResponse.data._id,
                feedback: feedbackRes,
                overallScore: feedbackRes?.overallScore,
                summary: "summary",
            })
            console.log("resumeFeedback", resumeFeedback)
            setStatusText('Analysis complete, redirecting...');

            navigate(`/resume/${uploadedResponse?.data?._id}`, {state: {feedback: feedbackRes}});

        } catch (e) {
            console.log('error', e)

        }

    }
    console.log({genData})

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault()
        const form = event.currentTarget.closest("form");
        if (!form) return
        const formData = new FormData(form);
        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        if (!file) return;
        await handleAnalyze({companyName, file, jobDescription, jobTitle})

    }
    return (<main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar/>
        <section className="main-section py-16">
            <div className={"page-heading"}>
                <h1>Smart feedback for your dream job</h1>
                {isProcessing ? (<><h2>{statusText}</h2>
                    <img alt={""} src="/images/resume-scan.gif"/>
                </>) : <><h2>Drop your resume for an ATS score and improvements</h2>
                    <form id={"upload-form"} onSubmit={handleSubmit} className={"flex flex-col gap-4 mt-4"}>
                        <div className={"form-div"}>
                            <label htmlFor={"company-name"}>Company Name</label>
                            <input type={"text"} name={"company-name"} placeholder={"Company Name"}/>
                        </div>

                        <div className={"form-div"}>
                            <label htmlFor={"job-title"}>Job Title</label>
                            <input type={"text"} name={"job-title"} placeholder={"Job Title"}/>
                        </div>


                        <div className={"form-div"}>
                            <label htmlFor={"job-description"}>Job Description</label>
                            <textarea rows={5} name={"job-description"} placeholder={"Job Description"}/>
                        </div>

                        <div className={"form-div"}>
                            <label htmlFor={"job-description"}>Upload Resume</label>
                            <FileUploader onFileSelect={handleFileSelect}/>
                        </div>
                        <button className={"primary-button"} type={"submit"}>Analyze Resume</button>
                    </form>
                </>}

                {genData && JSON.stringify(genData)}
            </div>

        </section>
    </main>)
}
export default Upload
