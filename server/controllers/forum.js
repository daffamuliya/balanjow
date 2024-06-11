const model = require('../models/indexmodel');
const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../config/conn');
const controller = {};

controller.getAllForum = async (req, res) => {
  try {
    await model.forum
      .findAll({
        attributes: ['id', 'user_id', 'user', 'konten', 'created_at'],
        include: [
          {
            model: model.komentar_forum,
            attributes: ['id', 'forum_id', 'user_id', 'komentar', 'user', 'created_at'],
            required: false,
          },
        ],
        order: [['created_at', 'DESC']],
      })
      .then((result) => {
        if (result.length > 0) {
          res.json({ items: result });
        } else {
          result[0].user = 'kosongggg';
          result[0].konten = 'masih kosong nih forumnya';
          res.json({ items: result });
        }
      });
  } catch (error) {
    res.status(404).json({
      message: error,
    });
  }
};

controller.getAllDashboardForum = async (req, res) => {
  try {
    let response;
    if (req.role === 'admin') {
      response = await model.forum.findAll({
        include: [
          {
            model: model.komentar_forum,
            attributes: ['id', 'forum_id', 'user_id', 'komentar', 'user', 'created_at'],
            required: false,
          },
        ],
      });
    } else {
      response = await model.forum.findAll({
        where: {
          user_id: req.userId,
        },
        include: [
          {
            model: model.komentar_forum,
            attributes: ['id', 'forum_id', 'user_id', 'komentar', 'user', 'created_at'],
            required: false,
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Terjadi kesalahan dalam mengambil data forum',
    });
  }
};

controller.getForumById = async (req, res) => {
  try {
    await model.forum
      .findOne({
        attributes: ['id', 'user_id', 'user', 'konten'],
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

controller.addForum = async (req, res) => {
  try {
    const { forum_id, user_id, user, konten } = req.body;
    await model.forum.create({ forum_id, user_id, user, konten });
    res.redirect('/forum');
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.updateForum = async (req, res) => {
  try {
    const { user_id, user, konten } = req.body;
    await model.forum.update(
      { user_id, user, konten },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json({
      message: 'berhasil edit blog',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.deleteForum = async (req, res) => {
  try {
    await model.forum.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({
      message: 'berhasil happus data',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.getAllComment = async (req, res) => {
  try {
    await model.komentar_forum
      .findAll({
        attributes: ['id', 'forum_id', 'user_id', 'komentar'],
      })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({
            data: result,
          });
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

controller.getCommentById = async (req, res) => {
  try {
    await model.komentar_forum
      .findAll({
        attributes: ['id', 'forum_id', 'user_id', 'komentar', 'user'],

        where: {
          forum_id: req.params.forum_id,
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

controller.addForumComment = async function (req, res) {
  const { user_id, forum_id, komentar, user } = req.body;

  try {
    await model.komentar_forum.create({ user_id, forum_id, komentar, user });
    res.redirect('/forum');
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.deleteForumComment = async (req, res) => {
  try {
    await model.komentar_forum.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'berhasil hapus data komentar',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.getTotalForum = async (req, res) => {
  try {
    await model.forum.count().then((count) => {
      res.json({ totalForum: count });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = controller;
