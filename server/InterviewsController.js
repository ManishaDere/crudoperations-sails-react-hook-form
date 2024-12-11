/**
 * InterviewsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  // Get all job applications
  getInterviews: async (req, res) => {
    try {
      const interviews = await Interviews.find();
      return res.json(interviews);
    } catch (error) {
      return res.serverError(error);
    }
  },
  createInterview: async function (req, res) {
    try {
      const { jobTitle, interviewerEmail, dateAndTime, candidate, associateTags } = req.body;
      const errors = [];

      if(!jobTitle) {
        errors.push({ field: 'jobTitle', message: "Job Title is required"})
      }

      if(!interviewerEmail) {
        errors.push({ field: 'interviewerEmail', message: "Interviwer Email is required"})
      }

      if(!dateAndTime) {
        errors.push({ field: 'dateAndTime', message: "DateAndTime is required"})
      }

      if (errors.length > 0) {
        return res.status(400).json({ 
            errors: errors
        });
      }

      const newInterview = await Interviews.create({
        jobTitle, interviewerEmail, dateAndTime, candidate, associateTags
      }).fetch();

      return res.status(201).json({ interview: newInterview });

    } catch (err) {
      return res.serverError(err);
    }
  },
  update: async function(req, res) {
    try {
      const interviewId = req.params.id;
      const { jobTitle, interviewerEmail } = req.body;
      const errors = [];

      if(!jobTitle) {
        errors.push({ field: 'jobTitle', message: "Job Title is required"})
      }

      if(!interviewerEmail) {
        errors.push({ field: 'interviewerEmail', message: "Interviwer Email is required"})
      }

      const updatedData = req.body;

      // Update the interview based on the given ID and new data
      const updatedInterview = await Interviews.updateOne({ id: interviewId }).set(updatedData);

      if (!updatedInterview) {
        return res.status(404).json({ message: 'Interview not found' });
      }

      return res.status(200).json({
        message: 'Interview updated successfully',
        data: updatedInterview,
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Error updating interview',
        error: error.message,
      });
    }
  },
  // Delete interview action
  deleteInterview: async function(req, res) {
    try {
      const interviewId = req.params.id;

      // Delete the interview based on the given ID
      const deletedInterview = await Interviews.destroyOne({ id: interviewId });

      if (!deletedInterview) {
        return res.status(404).json({ message: 'Interview not found' });
      }

      return res.status(200).json({
        message: 'Interview deleted successfully',
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting interview',
        error: error.message,
      });
    }
  },
  // Get interview by ID
  getInterview: async function(req, res) {
    try {
      const interviewId = req.params.id;

      // Fetch the interview with the given ID
      const interview = await Interviews.findOne({ id: interviewId });

      if (!interview) {
        return res.status(404).json({ message: 'Interview not found' });
      }

      return res.status(200).json({
        message: 'Interview fetched successfully',
        data: interview,
      });

    } catch (error) {
      return res.status(500).json({
        message: 'Error fetching interview',
        error: error.message,
      });
    }
  },
};

