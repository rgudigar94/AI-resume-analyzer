export interface ResumeFeedbackType {
    overallScore: number
    ATS: Ats
    toneAndStyle: ToneAndStyle
    content: Content
    structure: Structure
    skills: Skills
    missingthings: Missingthings
    strongPoints: StrongPoints
    weakAreas: WeakAreas
    rejectionChances: RejectionChances
}

export interface Ats {
    score: number
    tips: Tip[]
}

export interface Tip {
    type: string
    tip: string
    explanation: string
}

export interface ToneAndStyle {
    score: number
    tips: Tip2[]
}

export interface Tip2 {
    type: string
    tip: string
    explanation: string
}

export interface Content {
    score: number
    tips: Tip3[]
}

export interface Tip3 {
    type: string
    tip: string
    explanation: string
}

export interface Structure {
    score: number
    tips: Tip4[]
}

export interface Tip4 {
    type: string
    tip: string
    explanation: string
}

export interface Skills {
    score: number
    tips: Tip5[]
}

export interface Tip5 {
    type: string
    tip: string
    explanation: string
}

export interface Missingthings {
    score: number
    tips: Tip6[]
}

export interface Tip6 {
    type: string
    tip: string
    explanation: string
}

export interface StrongPoints {
    score: number
    tips: Tip7[]
}

export interface Tip7 {
    type: string
    tip: string
    explanation: string
}

export interface WeakAreas {
    score: number
    tips: Tip8[]
}

export interface Tip8 {
    type: string
    tip: string
    explanation: string
}

export interface RejectionChances {
    score: number
    tips: Tip9[]
}

export interface Tip9 {
    type: string
    tip: string
    explanation: string
}
