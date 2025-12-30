import Course from "../models/Course.js"
import { clerkClient } from "@clerk/express"


// Get All Courses
export const getAllCourse = async (req, res) => {
    try {

        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator', select: '-password' })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}


// export const getAllCourse = async (req, res) => {
//     try {

//         const courses = await Course.find({ isPublished: true })
//             .select(['-courseContent', '-enrolledStudents'])

//         // Expand educator for all courses
//         const expandedCourses = await Promise.all(
//             courses.map(async (course) => {
//                 const user = await clerkClient.users.getUser(course.educator)

//                 return {
//                     ...course._doc,
//                     educator: {
//                         id: user.id,
//                         name: user.firstName + " " + user.lastName,
//                         imageUrl: user.imageUrl,
//                         email: user.emailAddresses[0].emailAddress
//                     }
//                 }
//             })
//         )

//         res.json({ success: true, courses: expandedCourses })

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }


// Get Course by Id
// export const getCourseId = async (req, res) => {

//     const { id } = req.params

//     try {

//         const courseData = await Course.findById(id)
//             .populate({ path: 'educator'})

//         // Remove lectureUrl if isPreviewFree is false
//         courseData.courseContent.forEach(chapter => {
//             chapter.chapterContent.forEach(lecture => {
//                 if (!lecture.isPreviewFree) {
//                     lecture.lectureUrl = "";
//                 }
//             });
//         });

//         res.json({ success: true, courseData })

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }

// } 

// Get Course by Id
export const getCourseId = async (req, res) => {

    const { id } = req.params

    try {

        // 1. Get the course
        const courseData = await Course.findById(id)

        if (!courseData) {
            return res.json({ success: false, message: "Course not found" })
        }

        // 2. Fetch educator details from Clerk
        const educator = await clerkClient.users.getUser(courseData.educator)

        // 3. Replace educator string with full object
        courseData._doc.educator = {
            id: educator.id,
            name: educator.firstName + " " + educator.lastName,
            email: educator.emailAddresses[0].emailAddress,
            imageUrl: educator.imageUrl
        }

        // 4. Remove lectureUrl if preview is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            });
        });

        res.json({ success: true, courseData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}