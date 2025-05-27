const express = require('express');
const router = express.Router();
const {User ,Feedback, Appointment} = require('../models/User');
// = require('../models/User')

router.post('/feedback-post', async(req, res) => {
    const {userId, name, age, responseData, prediction } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: 'No user found'})
        }

        const newFeedback = new Feedback({
            userId: userId,
            name: name,
            age: age,
            responseData: responseData,
            prediction: prediction,
            createdAt: new Date()
        })

        await newFeedback.save()

        res.status(201).json({
            message: 'Feedback Saved Successfullly',
            success: true
        })
    } catch(error) {
        console.log(error)
        res.status(500).json({
            message: 'Error Saving Feedback'
        })
    }
})

router.post('/feedback-fetch', async(req,res) => {
    const {userId} = req.body;
    try {
        const feedbacks = await Feedback.find({userId: userId})

        if (!feedbacks || feedbacks.length === 0) {
          return res.status(404).json({
            message: "No feedback found for this user"
          })
        }

        res.status(200).json({
            feedbacks
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error Fetching Feedback"
        })
    }
})

router.get('/appointments/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const appointments = await Appointment.find({ userId: userId });

        if (!appointments || appointments.length === 0) {
            return res.status(404).json({
                message: "No appointments found for this user"
            });
        }

        res.status(200).json({
            appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Fetching Appointments"
        });
    }
});

router.post('/appointments', async (req, res) => {
    const { userId, appointmentName, appointmentDate } = req.body;

    if (!userId || !appointmentName || !appointmentDate) {
        return res.status(400).json({
            message: "Please provide all required fields (userId, appointmentName, appointmentDate)"
        });
    }

    try {
        const newAppointment = new Appointment({
            userId,
            appointmentName,
            appointmentDate
        });

        await newAppointment.save();

        res.status(201).json({
            message: "Appointment Created Successfully",
            appointment: newAppointment
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Creating Appointment"
        });
    }
});

module.exports = router;