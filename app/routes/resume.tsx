import React, {useEffect, useState} from 'react'
import {Link, useLocation, useNavigate, useParams} from "react-router";
import {useAxiosCrud} from "~/hooks/useAxios";
import {API_URL} from "~/constants";
import Summary from "~/components/Summary";
import ATSScore from "~/components/ATSScore";
import Details from "~/components/Details";

export const meta = () => ([
    {title: 'Resumizer | Review '},
    {name: 'description', content: 'Detailed overview of your resume'},
])


const Resume = () => {
    const {id} = useParams()
    const {getById} = useAxiosCrud(API_URL + "/resumesUpload", false);
    const {state} = useLocation()
    console.log({state, id})
    const fetchCurrentResume = async () => {
        if (state) {
            setFeedback(state?.feedback)
        }
        if (id != null) {
            const response = await getById(id)
            setImageUrl(`http://localhost:5000/${response.data.imageUrl}`)
            setResumeUrl(`http://localhost:5000/${response.data.pdfUrl}`)
        }

    }

    useEffect(() => {
        fetchCurrentResume()
    }, [id, state]);


    const [imageUrl, setImageUrl] = useState("")
    const [resumeUrl, setResumeUrl] = useState("")
    const [feedback, setFeedback] = useState(state?.feedback)
    const navigate = useNavigate();
    console.log({imageUrl, resumeUrl, feedback})

    return (
        <main className={"!pt-0"}>
            <nav className={"resume-nav"}>
                <Link to="/" className={"back-button"}>
                    <img alt="back" src="/icons/back.svg" className={"w-2.5 h-2.5"}/>
                    <span className={"text-gray-700"}>Back to Homepage</span>
                </Link>
            </nav>
            <div className={"flex flex-row w-full max-lg:flex-col-reverse"}>
                <section
                    className={"feedback-section bg-[url('images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center "}>
                    {imageUrl && resumeUrl && (
                        <div className={"animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] w-fit"}>
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img alt={""} className={"w-full h-full object-contain rounded-2xl "} title={"resume"}
                                     src={imageUrl}/>
                            </a>
                        </div>)}
                </section>
                <section className={"feedback-section"}>
                    <h2 className={"text-4xl !text-black font-bold"}>Resume Review & Feedback</h2>
                    {feedback ? <div className={"flex flex-col gap-8 animate-in fade-in duration-1000 "}>
                        <Summary feedback={feedback}/>
                        <ATSScore score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                        <Details feedback={feedback}/>
                    </div> : <><img
                        alt={""} className={"w-full"} src="/images/resume-scan-2.gif"/></>}
                </section>
            </div>
        </main>
    )
}
export default Resume
