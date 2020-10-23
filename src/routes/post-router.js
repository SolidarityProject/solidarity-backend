const express = require("express");
const postController = require("../controllers/post-controller");
const middleware = require("../middlewares/auth");

const router = express.Router();

//* get by id
router.get("/:postId", middleware.auth, postController.getById);

//* get details by id
router.get("/:postId/details", middleware.auth, postController.getDetailById);

//* get by user id
router.get("/u/:userId", middleware.auth, postController.getListByUserId);

//* get by district address
router.get("/district/:districtId", middleware.auth, postController.getListByDistrictId);

//* get by province address
router.get("/province/:provinceId", middleware.auth, postController.getListByProviceId);

//* get by province address for free user (not required token)
router.get("/free/:provinceId", postController.getListByProvinceIdForFree);

//* add
router.post("/", middleware.auth_post_verified, postController.add);

//* update
router.put("/", middleware.auth_post, postController.update);

//* delete
router.delete("/", middleware.auth_post, postController.delete);

//* starred-post

//* get starred users by post id
router.get("/:postId/starred", middleware.auth, postController.getStarredUsersByPostId);

module.exports = router;
