const model = require('../models/indexmodel');
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../config/conn');
const controller = {};
const path = require('path');

controller.getAllUser = async (req, res) => {
  try {
    await model.users
      .findAll({
        attributes: ['id', 'uuid', 'username', 'name', 'email', 'no_telp', 'alamat', 'created_at'],
      })
      .then((result) => {
        if (result.length > 0) {
          res.json({ items: result });
        } else {
          res.status(404).json({
            message: 'data tidak ada',
            data: [],
          });
        }
      });
  } catch (error) {
    res.json({ error });
  }
};

controller.getUserById = async (req, res) => {
  try {
    await model.users
      .findOne({
        attributes: ['id', 'uuid', 'username', 'name', 'email', 'no_telp', 'alamat'],
        where: {
          id: req.params.id,
        },
      })
      .then((result) => {
        if (result) {
          res.json({ items: result });
        } else {
          res.status(404).json({
            message: 'data tidak ada',
            data: [],
          });
        }
      });
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
};

controller.deleteUser = async (req, res) => {
  try {
    await model.users.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({
      message: 'berhasil happus data',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.getTotalUsers = async (req, res) => {
  try {
    await model.users.count().then((count) => {
      res.json({ totalUsers: count });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = controller;
