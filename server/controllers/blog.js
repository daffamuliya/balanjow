const model = require('../models/indexmodel');
const { Op, QueryTypes } = require('sequelize');
const slugify = require('slugify');
const { blog } = require('./indexcontroller');
const path = require('path');
const controller = {};
const fs = require('fs');

controller.getAllBlog = async (req, res) => {
  try {
    await model.blog
      .findAll({
        order: [['created_at', 'DESC']],
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

controller.getAllDashboardBlog = async (req, res) => {
  try {
    let response;
    if (req.role === 'admin') {
      response = await model.blog
        .findAll({
          order: [['created_at', 'DESC']],
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
    } else {
      response = await model.blog
        .findAll({
          where: {
            user_id: req.userId,
          },
          order: [['created_at', 'DESC']],
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
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Terjadi kesalahan dalam mengambil data blog',
    });
  }
};

controller.getBlogBySlug = async (req, res) => {
  try {
    await model.blog
      .findOne({
        where: {
          slug: req.params.slug,
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
    res.json({ error });
  }
};

controller.addBlog = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: 'No File Uploaded' });
  const user_id = req.body.user_id;
  const user = req.body.user;
  const judul = req.body.judul;
  const slug = req.body.slug;
  const kategori_blog = req.body.kategori_blog;
  const summary = req.body.summary;
  const konten = req.body.konten;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' });
  if (fileSize > 5000000) return res.status(422).json({ msg: 'Image must be less than 5 MB' });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await model.blog.create({ user_id: user_id, kategori_blog: kategori_blog, judul: judul, slug: slug, summary: summary, konten: konten, user: user, gambar: fileName, url: url });
      res.redirect('/blog');
    } catch (error) {
      console.log(error.message);
    }
  });
};

controller.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { user_id, user, judul, slug, kategori_blog, summary, konten } = req.body;

  try {
    const blog = await model.blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
      const allowedType = ['.png', '.jpg', '.jpeg'];

      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: 'Invalid Image Type' });
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: 'Image must be less than 5 MB' });
      }

      // Hapus file gambar lama jika ada
      if (blog.gambar) {
        const oldFilePath = path.join(__dirname, './public/images', blog.gambar);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message });
        }

        // Update data blog dengan gambar baru
        blog.user_id = user_id;
        blog.user = user;
        blog.judul = judul;
        blog.slug = slug;
        blog.kategori_blog = kategori_blog;
        blog.summary = summary;
        blog.konten = konten;
        blog.gambar = fileName;
        blog.url = url;

        await blog.save();
        res.redirect('/blog');
      });
    } else {
      // Update data blog tanpa mengganti gambar
      blog.user_id = user_id;
      blog.user = user;
      blog.judul = judul;
      blog.slug = slug;
      blog.kategori_blog = kategori_blog;
      blog.summary = summary;
      blog.konten = konten;

      await blog.save();
      res.redirect('/blog');
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

controller.deleteBlog = async function (req, res) {
  try {
    await model.blog.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'berhasil hapus blog',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.getAllComment = async (req, res) => {
  try {
    await model.komentar_blog
      .findAll({
        attributes: ['id', 'blog_id', 'user_id', 'user', 'komentar'],
      })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({
            message: 'mendapat data komentar',
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

controller.addBlogComment = async function (req, res) {
  const { blog_id, user_id, komentar, user } = req.body;

  try {
    await model.komentar_blog.create({ blog_id, user_id, user, komentar });
    res.redirect('back');
  } catch (error) {
    console.log(error);
  }
};

controller.deleteBlogComment = async (req, res) => {
  try {
    await model.komentar_blog.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'berhasil hapus komen',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.tampilTambahBlog = async (req, res) => {
  try {
    await model.kategori_blog.findAll().then((result) => {
      if (result.length > 0) {
        res.json({ items: result });
      } else {
        res.status(200).json({
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

controller.getTotalBlog = async (req, res) => {
  try {
    await model.blog.count().then((count) => {
      res.json({ totalBlog: count });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = controller;
