const express = require("express");
const router = express.Router();

const Report = require("../models/report");
const User = require("../models/user");
const Adaptor = require("../models/adaptor")

router.get("/userReports", async (req, res) => {
  try {
    const reports = await Report.find().populate("reportedBy")
    const currentUserId = req.session.user._id;
    // console.log('hhhhhhh:'+ ownerId)
    // console.log('reportedBy123123: '+req.body.reportedBy)
    // console.log('reportedBy444444: '+req.session.user._id)
    // console.log(reports)
    res.render("report/userList.ejs", {
      reports: reports,
      currentUserId: currentUserId,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/allReports", async (req, res) => {
  try {
    const reports = await Report.find().populate("reportedBy")
    const currentUserId = req.session.user._id;

    res.render("report/allList.ejs", { reports: reports })
  } catch (error) {
    console.log(error);
  }
});

router.get("/new", (req, res) => {
  res.render("report/new.ejs");
});

router.post("/userReports", async (req, res) => {
  req.body.reportedBy = req.session.user._id
  console.log("reportedBy: " + req.body.reportedBy)
  const createdReport = await Report.create(req.body)
  res.redirect("/report/userReports")
});



router.delete("/userReports/:reportId", async (req, res) => {
  try {
    const chosenReport = await Report.findById(req.params.reportId)
    await chosenReport.deleteOne()

    res.redirect("/report/userReports")
  } catch (error) {
    console.error(error)
    res.redirect("/")
  }
})


router.get('/userReports/:reportId/edit', async (req, res) => {
  try{
    const chosenReport = await Report.findById(req.params.reportId)
    res.render('report/edit.ejs', {
      chosenReport: chosenReport,
    })
  }
  catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

router.put('/userReports/:reportId', async (req, res) => {
  try {
    const chosenReport = await Report.findById(req.params.reportId)
      await chosenReport.updateOne(req.body);
      
      res.redirect('/report/userReports');

  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
})


router.get('/allReports/:reportId/adapt', async (req, res) => {
  try{
    const chosenReport = await Report.findById(req.params.reportId)
    const currentUser = await User.findById(req.session.user._id)
    // const currentUserId = req.session.user._id
    // console.log(currentUser)

    res.render('adapt/adaptRequest.ejs', {
      chosenReport: chosenReport,
      currentUser:currentUser
    })
  }
  catch (error) {
    console.error(error)
    res.redirect("/")
  }
})


router.post("/allReports/:reportId/adapt", async (req, res) => {
  req.body.username = req.session.user._id
  // const chosenReport = await Report.findById(req.params.reportId)
// console.log("kkkkkkkkk: " + chosenReport)
  // req.body.reportInfo = chosenReport
  // console.log("reportedBy: " + req.body.reportedBy);
  const adaptor = await Adaptor.create(req.body)
  const reportId = req.params.reportId
// console.log("kkkkkkkkk: " + reportId)

  // const adaptorId = adaptor._id

  res.render("adapt/nextStep.ejs", {adaptor:adaptor})
  // res.redirect(`/report/allReports/${reportId}/adapt/${adaptorId}`)
  // res.redirect(`/report/allReports/${reportId}/adapt/${adaptorId}`)
})

// router.get("allReports/:reportId/adapt/nextStep", async (req, res) => {
//   try{
//     const chosenReport = await Report.findById(req.params.reportId)
//     const currentUser = await User.findById(req.session.user._id)
//     // const currentUserId = req.session.user._id
//     // console.log(currentUser)

//     res.render('adapt/adaptor.ejs', {
//       chosenReport: chosenReport,
//       currentUser:currentUser
//     })
//   }
//   catch (error) {
//     console.error(error)
//     res.redirect("/")
//   }
// })


router.get("/allReports/:reportId/adapt/nextStep/:adaptor", async (req, res) => {
  try{
    const chosenReport = await Report.findById(req.params.reportId).populate('reportedBy')
    // const adaptorInfo = await Adaptor.findById(req.params.adaptor)
    const adaptorInfo = await Adaptor.findById(req.params.adaptor).populate('reportInfo').populate('username')
    console.log('Chosen Report:', adaptorInfo)

    // const currentUser = await User.findById(req.session.user._id)
    // const currentUserId = req.session.user._id
    // console.log(currentUser)

    res.render('adapt/adaptorMail.ejs', {
      chosenReport: chosenReport,
      adaptorInfo:adaptorInfo,
      
    })
  }
  catch (error) {
    console.error(error)
    res.redirect("/")
  }
})

module.exports = router
