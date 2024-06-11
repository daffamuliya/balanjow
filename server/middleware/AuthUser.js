const User = require('../models/users.js');

const verifyUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!req.session.userId) {
    return res.status(401).json({ msg: 'Mohon login ke akun anda' });
  }

  try {
    const user = await User.findOne({
      attributes: ['uuid', 'name', 'email', 'role', 'id', 'username'],
      where: {
        uuid: req.session.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    req.userId = user.id;
    req.role = user.role;
    next();
  } catch (error) {
    console.error('Error dalam middleware verifyUser:', error);
    return res.status(500).json({ msg: 'Terjadi kesalahan dalam memverifikasi pengguna' });
  }
};

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findOne({
      attributes: ['uuid', 'name', 'email', 'role', 'username'],
      where: {
        uuid: req.session.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User tidak ditemukan' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Akses terlarang' });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Terjadi kesalahan dalam memverifikasi pengguna' });
  }
};

module.exports = { verifyUser, adminOnly };
