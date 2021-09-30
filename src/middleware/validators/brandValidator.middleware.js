const db = require("../../models");
const { body, param } = require("express-validator");
const { Op } = require("sequelize");

const Brand = db.brands;

exports.createBrandSchema = [
  body("name")
    .exists()
    .withMessage("name is required")
    .isLength({ max: 255 })
    .withMessage("Must be at most 255 chars long")
    .custom((value) => {
      return Brand.findAll({ where: { name: value } }).then((brand) => {
        if (brand.length) {
          return Promise.reject(`The name '${value}' is already in use`);
        }
      });
    }),
  body("subtitle")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Must be at most 255 chars long"),
  body("icon")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Must be at most 255 chars long"),
];

exports.updateBrandSchema = [
  // param("id").custom((value) => {
  //   return Brand.findByPk(value).then((brand) => {
  //     if (brand === null) {
  //       return Promise.reject(`Model not found`);
  //     }
  //   });
  // }),
  body("name")
    .exists()
    .withMessage("name is required")
    .isLength({ max: 255 })
    .withMessage("Must be at most 255 chars long")
    .custom((value, { req }) => {
      return Brand.findAll({
        where: { id: { [Op.ne]: req.params.id }, name: value },
      }).then((brand) => {
        if (brand.length) {
          return Promise.reject(`The name '${value}' is already in use`);
        }
      });
    }),
  body("subtitle")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Must be at most 255 chars long"),
  body("icon")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Must be at most 255 chars long"),
];
