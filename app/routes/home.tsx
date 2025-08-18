import type {Route} from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {useAppStore} from "~/store";
import {selectSignIn, selectSignOut, selectUser} from "~/store/features/auth/auth.selectors";
import {useAxiosCrud} from "~/hooks/useAxios";
import type {GetResumeUploadResponse} from "../../types/resumeUploads";
import {API_URL} from '~/constants'

export function meta({}: Route.MetaArgs) {
    return [
        {title: "Resumize"},
        {name: "description", content: "Smart resume analyzer for your dream job role !"},
    ];
}

export default function Home() {
    const user = useAppStore(selectUser)
    const signIn = useAppStore(selectSignIn);
    const signOut = useAppStore(selectSignOut);
    const {
        data: uploadedResumes,
    } = useAxiosCrud<GetResumeUploadResponse>(API_URL + "/resumesUpload", true)
    console.log('uploadedResumes', uploadedResumes)

    return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar/>

        <section className="main-section">
            <div className="page-heading py-4">
                <h1>Track your Applications & Resume Ratings</h1>
                <h2>Review your submissions and check AI-powered feedback.</h2>
            </div>
            {!!resumes?.length && <div className={"resumes-section"}>
                {resumes.map((item, index) => (<ResumeCard resume={item} key={index}/>))}</div>}

        </section>
    </main>;
}
