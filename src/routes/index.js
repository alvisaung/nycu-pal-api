const express = require("express");
const router = express.Router();
const aboutLabRoutes = require("./aboutLabRoutes.js");
const eventsController = require("../controllers/eventsController.js");
const eventTypeController = require("../controllers/eventTypeController.js");
const memberController = require("../controllers/memberController.js");
const publicationController = require("../controllers/publicationController.js");
const pubTypeController = require("../controllers/publicationTypeController.js");
const researchController = require("../controllers/researchController.js");
const researchTopicController = require("../controllers/researchTopicController.js");
const generalUtil = require("../controllers/generalController.js");
const multer = require("multer");

const upload = multer().none();

router.use("/about-lab", upload, aboutLabRoutes);
router.post("/admin", upload, generalUtil.generalController.adminLogin);
router.get("/admin", async (req, res) => {
  res.status(200).json({});
});
router.route("/events").get(eventsController.get).put(eventsController.createOrUpdate).delete(upload, eventsController.delete);
router.route("/events-type").get(eventTypeController.get).put(upload, eventTypeController.createOrUpdate).delete(upload, eventTypeController.delete);
router.route("/member").get(memberController.get).put(upload, memberController.createOrUpdate).delete(upload, memberController.delete);
router.route("/publication").get(publicationController.get).put(upload, publicationController.createOrUpdate).delete(upload, publicationController.delete);
router.route("/publication-type").get(pubTypeController.get).put(upload, pubTypeController.createOrUpdate).delete(upload, pubTypeController.delete);
router.route("/research").get(researchController.get).put(upload, researchController.createOrUpdate).delete(upload, researchController.delete);
router.route("/research-topic").get(researchTopicController.get).put(upload, researchTopicController.createOrUpdate).delete(upload, researchTopicController.delete);
router.route("/research-branch").put(upload, researchTopicController.createOrUpdateBranch).delete(upload, researchTopicController.deleteBranch);
router.route("/upload-img").post(generalUtil.upload.single("images", 2), generalUtil.generalController.uploadImg).delete(upload, generalUtil.generalController.deleteImg);

module.exports = router;
