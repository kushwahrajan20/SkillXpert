import Stripe from "stripe"
import {Course} from "../model/course.model.js"
import {CoursePurchase} from "../model/coursePurchase.model.js"
import { Lecture } from "../model/lecture.model.js";
import User from "../model/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async(req,res)=>{
    try {
        const userId = req.id;
        const {courseId} = req.body;

        const course = await Course.findById(courseId);
        if(!course) return res.status(404).json({message:"Course not found!"})

        //Create a new course purchase record
        const newPurchase = new  CoursePurchase({
            courseId,
            userId,
            amount: course.coursePrice,
            status:"pending"
        });

        //Create a strip checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: course.courseTitle,
                            images: [course.courseThumbnail],
                        },
                        unit_amount: course.coursePrice * 100, // Amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
            cancel_url: `${process.env.FRONTEND_URL}/course-details/${courseId}`,
            metadata: {
                courseId: courseId,
                userId: userId,
            },
            shipping_address_collection: {
                allowed_countries: ['IN'],
            },
        });
        if(!session.url){
            return res.status(400).json({success:false,message:"Error while creating session"});
        }

        //save the purchase record
        newPurchase.paymentId = session.id;
        await newPurchase.save();

        return res.status(200).json({
            success: true,
            url: session.url,
        });

    } catch (error) {
        console.log(error)
    }
};
export const stripeWebhook = async (req, res) => {
    let event;
    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
        console.error("Webhook Error:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    // Handle the event
    if (event.type === 'checkout.session.completed') {
        try {
            const session = event.data.object;
            const purchase = await CoursePurchase.findOne({ paymentId: session.id }).populate({ path: 'courseId' });

            if(!purchase){
                return res.status(404).json({ message: "Purchase not found" });
            }
            if(session.amount_total){
                purchase.amount = session.amount_total / 100; // Convert from paise to rupees
            }
            purchase.status = "completed";

            //Make all lectures visible by setting `isPreviewFree` to true
            if(purchase.courseId &&purchase.courseId.lectures.length > 0) {
                await Lecture.updateMany(
                    { _id: { $in: purchase.courseId.lectures } },
                    { $set: { isPreviewFree : true } }
                );
            }
            await purchase.save();

            // Update user's enrolled courses
            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolledCourses : purchase.courseId._id} },//Add userid to enrolled courses
                { new: true }
            );

            //Update course to add user ID to enrolledStudents
            await User.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledCourses : purchase.userId } },//Add userid to enrolled courses
                { new: true }
            );

        } catch (error) {
            console.error("Error handling event:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    res.status(200).send();

};
export const getCourseDetailWithPurchaseStatus = async(req,res) =>{
    try {
        const {courseId}= req.params;
        const userId = req.id;

        const course = await Course.findById(courseId)
         .populate({path: "creator"})
         .populate({path:"lectures"});
        
        const purchased = await CoursePurchase.findOne({userId,courseId});

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }

         return res.status(200).json({
               course,
               purchased: !!purchased, //true if purchased, false otherwise
            })
        
    } catch (error) {
        console.log(error);
    }
}

export const getAllPurchasedCourse = async(_,res)=>{
    try {
        const purchasedCourses = await CoursePurchase.find({status:"completed"}).populate("courseId");
        
        if(!purchasedCourses){
            return res.status(404).json({
                purchasedCourse:[]
            });
        }
        return res.status(200).json({
            purchasedCourses,
        })
    } catch (error) {
        console.log(error);
    }
}