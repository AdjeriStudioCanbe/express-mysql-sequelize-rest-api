const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brand.controller");

const {
  createBrandSchema,
  updateBrandSchema,
} = require("../middleware/validators/brandValidator.middleware");

router.get("/", brandController.findAll);
router.get("/:id", brandController.findOne);
router.post("/", createBrandSchema, brandController.create);
router.put("/:id", updateBrandSchema, brandController.update);

module.exports = router;
