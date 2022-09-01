const router = require("express").Router({mergeParams: true});
const controller = require("./pastes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed")

router.route("/").get(controller.list).post(controller.create).all(methodNotAllowed);
router.route("/:pasteId").get(controller.read).put(controller.update).delete(controller.delete).all(methodNotAllowed);

module.exports = router;

//you're always just exporting the router but can perform multiple methods on it before exporting it.. so i can do two lines with two .route() methods.. cool! I get it!