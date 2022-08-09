import { ISchedule } from "@models/schedule"
import { ITutee } from "@models/tutee"
import { Tutor } from "@pages/admin/requests"
import { BareSession, IReqSession } from "@pages/api/requests"

export default function sorter(tutors: Tutor[], request: IReqSession, tutee: ITutee, sessions: BareSession[]) {
    tutors.sort((a, b) => {
        // check if preferred tutor
        if (request.preferred === a._id) return -1
        if (request.preferred === b._id) return 1

        // check number of subject matches
        let subjA = 0, subjB = 0
        for (let topic of a.topics) {
            for (let session of sessions) {
                if (topic[0] === session.subject) subjA++
            }
        }
        for (let topic of b.topics) {
            for (let session of sessions) {
                if (topic[0] === session.subject) subjB++
            }
        }
        if (subjA != subjB) return subjB - subjA

        // check tutee count
        if (a.tuteeCount < a.maxTuteeCount && b.tuteeCount >= b.maxTuteeCount) return -1
        if (b.tuteeCount < b.maxTuteeCount && a.tuteeCount >= a.maxTuteeCount) return 1

        // check schedule
        let freeA = 0, freeB = 0
        for (let day of Object.keys(tutee.schedule) as (keyof ISchedule)[]) {
            for (let time of tutee.schedule[day]) {
                for (let timeA of (a.schedule as ISchedule)[day]) {
                    if (time === timeA) {
                        freeA++
                        break
                    }
                }
            }
        }
        for (let day of Object.keys(tutee.schedule) as (keyof ISchedule)[]) {
            for (let time of tutee.schedule[day]) {
                for (let timeB of (b.schedule as ISchedule)[day]) {
                    if (time === timeB) {
                        freeB++
                        break
                    }
                }
            }
        }

        return freeB - freeA
    })
    
    return tutors
}