const db = require("../models");
const { validationResult } = require("express-validator");
const HttpException = require("../utils/HttpException.utils");

const Brand = db.brands;
const Op = db.Sequelize.Op;

// Create and Save a new Brand
exports.create = (req, res, next) => {
  checkValidation(req);

  const brand = {
    name: req.body.name,
    subtitle: req.body.subtitle ?? null,
    icon: req.body.icon ?? null,
  };
  Brand.create(brand)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

// Retrieve all Brands from the database.
exports.findAll = (req, res) => {
  const conditions = {};
  console.log(req.query);

  if (req.query.id) {
    conditions["id"] = req.query.id;
  }
  if (req.query.name) {
    conditions["name"] = { [Op.like]: `%${req.query.name}%` };
  }
  if (req.query.subtitle) {
    conditions["subtitle"] = { [Op.like]: `%${req.query.subtitle}%` };
  }

  Brand.findAll({ where: conditions })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving brands.",
      });
    });
};

// Find a single Brand with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Brand.findByPk(id)
    .then((data) => {
      if (data === null) {
        throw new Error();
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(404).send({
        message: "Model not found",
      });
    });
};

// Update a Brand by the id in the request
exports.update = (req, res) => {
  checkValidation(req);

  const id = req.params.id;

  const brand = {
    name: req.body.name,
    subtitle: req.body.subtitle ?? null,
    icon: req.body.icon ?? null,
  };
  Brand.update(brand, {
    where: { id: id },
  })
    .then((num) => {
      console.info(num);
      if (num == 1) {
        res.send({ message: "Brand was updated successfully!" });
      } else {
        res.status(404).send({ message: "Data could not be updated!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error updating Brand with id=" + id,
      });
    });
};

// Delete a Brand with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Brands from the database.
exports.deleteAll = (req, res) => {};

// Find all published Brands
exports.findAllPublished = (req, res) => {};

checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpException(400, "Validation failed", errors);
  }
};
