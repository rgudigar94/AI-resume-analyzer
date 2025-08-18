export interface GetResumeUploadResponse {
    success: boolean
    data: ResumeUploadResponse[]
    message: string
}
export interface GetResumeByIdUploadResponse {
    success: boolean
    data: ResumeUploadResponse
    message: string
}


export interface ResumeUploadResponse {
    _id: string
    jobTitle: string
    jobDescription: string
    jobCompany: string
    aboutJobCompany: string
    experience: string
    imageUrl: string
    pdfFilePath: string
    pdfFileName: string
    pdfFileSize: number
    mimeType: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface CreateResumeUploadResponse {
    success: boolean
    data: Data
    message: string
}

export interface Data {
    jobTitle: string
    jobDescription: string
    jobCompany: string
    aboutJobCompany: string
    experience: string
    imageUrl: string
    pdfUrl: string
    _id: string
    createdAt: string
    updatedAt: string
    __v: number
}
