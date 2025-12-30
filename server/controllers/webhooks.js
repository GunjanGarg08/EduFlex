import { Webhook } from "svix";
import User from "../models/User.js";
import stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";


// API Controller Function to Manage Clerk User with database
// export const clerkWebhooks = async (req, res) => {
//   try {

//     console.log("CLERK WEBHOOK HIT");
//     console.log(req.body);

//     // Create a Svix instance with clerk webhook secret.
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//     // Verifying Headers
//     // await whook.verify(JSON.stringify(req.body), {
//     //   "svix-id": req.headers["svix-id"],
//     //   "svix-timestamp": req.headers["svix-timestamp"],
//     //   "svix-signature": req.headers["svix-signature"]
//     // })

//     const payload = req.body.toString();

//     await whook.verify(payload, {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"]
//     });

//     // Getting Data from request body
//     const { data, type } = req.body

//     // Switch Cases for differernt Events
//     switch (type) {
//       case 'user.created': {

//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0].email_address,
//           name: data.first_name + " " + data.last_name,
//           imageUrl: data.image_url,
//           resume: ''
//         }
//         await User.create(userData)
//         res.json({})
//         break;
//       }

//       case 'user.updated': {
//         const userData = {
//           email: data.email_addresses[0].email_address,
//           name: data.first_name + " " + data.last_name,
//           imageUrl: data.image_url,
//         }
//         await User.findByIdAndUpdate(data.id, userData)
//         res.json({})
//         break;
//       }

//       case 'user.deleted': {
//         await User.findByIdAndDelete(data.id)
//         res.json({})
//         break;
//       }
//       default:
//         break;
//     }

//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }

export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString("utf8");

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const event = whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { type, data } = event;

    console.log("CLERK EVENT:", type);

    if (type === "user.created") {
      await User.create({
        _id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`,
        imageUrl: data.image_url,
        enrolledCourses: [],
      });

      console.log("User saved to MongoDB");
    }

    if (type === "user.updated") {
      await User.findByIdAndUpdate(data.id, {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`,
        imageUrl: data.image_url,
      });
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Clerk Webhook Error:", err.message);
    res.status(400).json({ success: false });
  }
};



// Stripe Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)


// Stripe Webhooks to Manage Payments Action
// export const stripeWebhooks = async (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   }
//   catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded': {

//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       // Getting Session Metadata
//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId,
//       });

//       const { purchaseId } = session.data[0].metadata;

//       const purchaseData = await Purchase.findById(purchaseId)
//       const userData = await User.findById(purchaseData.userId)
//       const courseData = await Course.findById(purchaseData.courseId.toString())

//       courseData.enrolledStudents.push(userData)
//       await courseData.save()

//       userData.enrolledCourses.push(courseData._id)
//       await userData.save()

//       purchaseData.status = 'completed'
//       await purchaseData.save()

//       break;
//     }
//     case 'payment_intent.payment_failed': {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       // Getting Session Metadata
//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId,
//       });

//       const { purchaseId } = session.data[0].metadata;

//       const purchaseData = await Purchase.findById(purchaseId)
//       purchaseData.status = 'failed'
//       await purchaseData.save()

//       break;
//     }
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   response.json({ received: true });
// }

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const purchaseId = session.metadata.purchaseId;

    console.log("Stripe checkout completed. Purchase ID:", purchaseId);

    const purchaseData = await Purchase.findById(purchaseId);
    if (!purchaseData) return res.json({ received: true });

    const userData = await User.findById(purchaseData.userId);
    const courseData = await Course.findById(purchaseData.courseId);

    // Enroll user
    userData.enrolledCourses.push(courseData._id);
    await userData.save();

    // Add student to course
    courseData.enrolledStudents.push(userData._id);
    await courseData.save();

    // Update purchase status
    purchaseData.status = "completed";
    await purchaseData.save();

    console.log("Enrollment completed");
  }

  res.json({ received: true });
};
