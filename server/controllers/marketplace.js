const model = require('../models/indexmodel');
const { Op, QueryTypes, Sequelize } = require('sequelize');
const controller = {};
const path = require('path');
const fs = require('fs');

controller.jualProduk = async (req, res) => {
  const kategori = await model.kategori_produk.findAll({ attributes: ['id', 'nama'] });

  res.json({ kategori });
};

controller.daftarBarang = async (req, res) => {
  const kategori = await model.kategori_produk.findAll({ attributes: ['id', 'nama'] });

  res.json({ kategori });
};

controller.pesananPelanggan = async (req, res) => {
  const kategori = await model.kategori_produk.findAll({ attributes: ['id', 'nama'] });

  res.json({ kategori });
};

controller.barangTerjual = async (req, res) => {
  const kategori = await model.kategori_produk.findAll({ attributes: ['id', 'nama'] });

  res.json({ kategori });
};

controller.riwayat = async (req, res) => {
  const kategori = await model.produk.findAll({ attributes: ['id', 'nama'] });

  res.json({ kategori });
};

controller.detailProduk = async (req, res) => {
  try {
    await model.produk
      .findOne({
        attributes: ['id', 'id_penjual', 'id_kategori', 'nama', 'gambar', 'deskripsi', 'rate', 'harga', 'stok', 'created_at'],
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

controller.detailPembayaran = async (req, res) => {
  const kategori = await model.kategori_produk.findAll({ attributes: ['id', 'nama'] });

  res.json({ kategori });
};

controller.bayar = async (req, res) => {
  const kategori = await model.kategori_produk.findAll({ attributes: ['id', 'nama'] });

  res.json({ kategori });
};

controller.transfer = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: 'Tidak ada berkas yang diunggah' });
    }

    const allowedTypes = ['.png', '.jpg', '.jpeg'];
    const { id_pembeli, total, produk, payment, alamat_pembeli, telp_pembeli } = req.body;
    const { bukti_transfer } = req.files;

    if (!allowedTypes.includes(path.extname(bukti_transfer.name).toLowerCase())) {
      return res.status(422).json({ msg: 'Bukti transfer tidak valid' });
    }

    if (bukti_transfer.size > 5000000) {
      return res.status(422).json({ msg: 'Ukuran bukti transfer harus kurang dari 5 MB' });
    }

    const buktiTransferName = bukti_transfer.md5 + path.extname(bukti_transfer.name);
    const buktiTransferUrl = `${req.protocol}://${req.get('host')}/images/${buktiTransferName}`;

    await bukti_transfer.mv(`./public/images/${buktiTransferName}`);

    const transaksiData = {
      id_pembeli,
      total,
      payment,
      alamat_pembeli,
      telp_pembeli,
      status_pembayaran: 'Menunggu Verifikasi',
      bukti_transfer: buktiTransferUrl,
    };

    // Debug log untuk data produk
    console.log('Produk data received:', produk);

    let productDetails;
    try {
      productDetails = JSON.parse(produk).map((item) => ({
        id_transaksi: null,
        id_produk: item.produk_id,
        id_penjual: item.id_penjual,
        telp_penjual: item.produk.telp_penjual,
        nama_produk: item.produk.nama,
        harga: item.total,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
        status: 'Pesanan di Proses',
      }));

      console.log('Parsed product details:', productDetails);
    } catch (error) {
      console.error('Error parsing produk:', error);
      return res.status(400).json({ msg: 'Format produk tidak valid' });
    }

    const productIds = productDetails.map((item) => item.id_produk);
    const existingProducts = await model.produk.findAll({
      where: {
        id: productIds,
      },
      attributes: ['id', 'stok'], // Tambahkan stok ke dalam atribut yang diambil
    });

    console.log('Existing products:', existingProducts);

    if (existingProducts.length !== productIds.length) {
      return res.status(400).json({ msg: 'Beberapa id_produk tidak valid' });
    }

    const result = await model.sequelize.transaction(async (t) => {
      const newTransaksi = await model.transaksi.create(transaksiData, { transaction: t });

      productDetails = productDetails.map((item) => ({ ...item, id_transaksi: newTransaksi.id }));

      await model.detail_transaksi.bulkCreate(productDetails, { transaction: t });

      // Kurangi stok produk
      for (const item of productDetails) {
        const product = existingProducts.find((p) => p.id === item.id_produk);
        if (product.stok < item.jumlah) {
          throw new Error(`Stok produk dengan id ${item.id_produk} tidak mencukupi.`);
        }
        await model.produk.update({ stok: product.stok - item.jumlah }, { where: { id: item.id_produk }, transaction: t });
      }

      return newTransaksi;
    });

    return res.status(200).json({ msg: 'Bukti transfer berhasil diunggah!', data: result });
  } catch (error) {
    console.error('Error saat menambahkan bukti transfer:', error);
    return res.status(500).json({ msg: 'Terjadi kesalahan saat menambahkan bukti transfer' });
  }
};

controller.allCart = async (req, res) => {
  const kategori = await model.kategori_produk.findAll({ attributes: ['id', 'nama'] });

  res.json({ kategori });
};

controller.getAllProduk = async (req, res) => {
  try {
    const result = await model.produk.findAll({
      attributes: ['id', 'id_penjual', 'id_kategori', 'nama', 'gambar', 'deskripsi', 'rate', 'harga', 'stok', 'created_at'],
      include: [
        {
          model: model.kategori_produk,
          attributes: ['nama'],
        },
      ],
    });

    if (result.length > 0) {
      res.json({ items: result });
    } else {
      res.status(404).json({
        message: 'data tidak ada',
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving data',
      error: error.message,
    });
  }
};

controller.getProdukByKategori = async (req, res) => {
  try {
    const { id_kategori } = req.params;
    const result = await model.produk.findAll({
      where: { id_kategori },
      attributes: ['id', 'id_penjual', 'id_kategori', 'nama', 'gambar', 'deskripsi', 'rate', 'harga', 'stok', 'created_at'],
      include: [
        {
          model: model.kategori_produk,
          attributes: ['nama'],
        },
      ],
    });

    if (result.length > 0) {
      res.json({ items: result });
    } else {
      res.status(404).json({
        message: 'data tidak ada',
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving data',
      error: error.message,
    });
  }
};

controller.getDashboard = async (req, res) => {
  try {
    const { role, userId } = req;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID tidak ditemukan',
      });
    }

    const queryOptions = role === 'admin' ? {} : { where: { id_penjual: userId } };

    const result = await model.produk.findAll(queryOptions);

    if (result.length > 0) {
      res.status(200).json({
        message: 'Berhasil mendapatkan produk',
        data: result,
      });
    } else {
      res.status(404).json({
        message: 'Data tidak ditemukan',
        data: [],
      });
    }
  } catch (error) {
    console.error('Error in getAllDashboardProduk:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan dalam memproses permintaan',
      error: error.message,
    });
  }
};

controller.requestedBanner = async (req, res) => {
  try {
    await model.requested_banner
      .findAll({
        attributes: ['id', 'id_user', 'nama_banner', 'deskripsi', 'gambar', 'bukti_transfer', 'status'],
        include: [
          {
            model: model.users,
            attributes: ['name'],
          },
        ],
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
    res.status(404).json({
      message: error,
    });
  }
};

controller.activeBanner = async (req, res) => {
  try {
    await model.active_banner
      .findAll({
        attributes: ['id', 'id_user', 'nama_banner', 'gambar', 'status'],
        include: [
          {
            model: model.users,
            attributes: ['name'],
          },
        ],
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
    res.status(404).json({
      message: error,
    });
  }
};

controller.getTotalBanner = async (req, res) => {
  try {
    await model.active_banner.count().then((count) => {
      res.json({ totalBanner: count });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

controller.getBannerById = async (req, res) => {
  try {
    await model.active_banner
      .findOne({
        attributes: ['id', 'gambar'],
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

controller.getProdukById = async (req, res) => {
  try {
    await model.produk
      .findOne({
        attributes: ['id', 'id_penjual', 'id_kategori', 'nama', 'gambar', 'deskripsi', 'rate', 'harga', 'stok'],
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

controller.updateProduk = async (req, res) => {
  const { id } = req.params;
  const { nama, stok, harga, deskripsi } = req.body;

  try {
    const produk = await model.produk.findByPk(id);
    if (!produk) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    if (req.files && req.files.file) {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = file.md5 + ext;
      const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
      const allowedType = ['.png', '.jpg', '.jpeg'];

      // Verifikasi tipe file
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ message: 'Tipe gambar tidak valid' });
      }

      // Verifikasi ukuran file
      if (fileSize > 5000000) {
        return res.status(422).json({ message: 'Ukuran gambar harus kurang dari 5 MB' });
      }

      // Hapus file gambar lama jika ada
      if (produk.gambar) {
        const oldFilePath = path.join(__dirname, './public/images', produk.gambar);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // Simpan file gambar baru
      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message });
        }

        // Update data produk dengan gambar baru
        produk.nama = nama;
        produk.stok = stok;
        produk.harga = harga;
        produk.deskripsi = deskripsi;
        produk.gambar = url;

        // Simpan perubahan
        await produk.save();

        // Redirect setelah berhasil memperbarui produk
        res.redirect('/produk');
      });
    } else {
      // Update data produk tanpa mengganti gambar
      produk.nama = nama;
      produk.stok = stok;
      produk.harga = harga;
      produk.deskripsi = deskripsi;

      // Simpan perubahan
      await produk.save();

      // Redirect setelah berhasil memperbarui produk
      res.redirect('/produk');
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

controller.addProduk = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: 'No File Uploaded' });
  const id_penjual = req.body.id_penjual;
  const telp_penjual = req.body.telp_penjual;
  const id_kategori = req.body.id_kategori;
  const nama = req.body.nama;
  const deskripsi = req.body.deskripsi;
  const harga = req.body.harga;
  const stok = req.body.stok;

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
      await model.produk.create({ id_penjual: id_penjual, telp_penjual: telp_penjual, id_kategori: id_kategori, nama: nama, deskripsi: deskripsi, harga: harga, stok: stok, gambar: url });
      res.redirect('/seller/product');
    } catch (error) {
      console.log(error.message);
    }
  });
};

controller.deleteProduk = async (req, res) => {
  try {
    await model.produk.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'berhasil hapus data',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.getAllCart = async function (req, res) {
  try {
    await model.cart
      .findAll({
        attributes: ['id', 'user_id', 'produk_id', 'jumlah', 'harga', 'sub_total', 'gambar', 'created_at'],
        include: [
          {
            model: model.produk,
            attributes: ['nama', 'deskripsi'],
          },
        ],
        where: {
          user_id: req.params.user_id,
        },
      })
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: 'mendapat cart',
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

controller.getMyCart = async function (req, res) {
  try {
    const result = await model.cart.findAll({
      include: [
        {
          model: model.produk,
          attributes: ['nama', 'deskripsi'],
        },
      ],
      where: {
        user_id: req.userId,
      },
    });

    if (result && result.length > 0) {
      // Memastikan ada data
      res.status(200).json({
        message: 'mendapat cart',
        data: result,
      });
    } else {
      res.status(404).json({
        message: 'data tidak ada',
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};

controller.getAllTransaksi = async function (req, res) {
  try {
    const result = await model.transaksi.findAll({
      include: [
        {
          model: model.users,
          attributes: ['name'],
        },
      ],
    });

    if (result.length > 0) {
      res.status(200).json({
        message: 'Berhasil mendapatkan transaksi',
        data: result,
      });
    } else {
      res.status(404).json({
        message: 'Data tidak ditemukan',
        data: [],
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan dalam memproses permintaan',
      error: error.message,
    });
  }
};

controller.getTransaksiByIdJual = async function (req, res) {
  try {
    const result = await model.detail_transaksi.findAll({
      where: {
        id_penjual: req.userId,
      },
      include: [
        {
          model: model.transaksi,
          attributes: ['alamat_pembeli', 'status_pembayaran', 'telp_pembeli', 'tanggal_pesan'],
        },
      ],
    });

    if (result.length > 0) {
      res.status(200).json({
        message: 'Berhasil mendapatkan transaksi',
        data: result,
      });
    } else {
      res.status(404).json({
        message: 'Data tidak ditemukan',
        data: [],
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan dalam memproses permintaan',
      error: error.message,
    });
  }
};

controller.getTotalOrder = async (req, res) => {
  try {
    await model.detail_transaksi
      .count({
        where: {
          id_penjual: req.userId,
        },
      })
      .then((count) => {
        res.json({ totalOrder: count });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

controller.getOmzetPenjualan = async function (req, res) {
  try {
    // Hitung total omzet penjualan
    const omzet = await model.detail_transaksi.sum('harga', {
      where: {
        id_penjual: req.userId,
      },
    });

    res.status(200).json({ msg: 'Omzet penjualan berhasil dihitung', omzet: omzet || 0 });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Terjadi kesalahan dalam memproses permintaan', error: error.message });
  }
};

controller.getFeePlatform = async function (req, res) {
  try {
    // Hitung total omzet penjualan
    const omzet = await model.detail_transaksi.sum('harga', {
      where: {
        id_penjual: req.userId,
      },
    });

    // Hitung fee 2,5 persen dari omzet
    const fee = (omzet || 0) * 0.025;

    res.status(200).json({ msg: 'Fee penjualan berhasil dihitung', fee: fee });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Terjadi kesalahan dalam memproses permintaan', error: error.message });
  }
};

controller.getTransaksiByIdBeli = async function (req, res) {
  try {
    const result = await model.transaksi.findAll({
      include: [
        {
          model: model.users,
          attributes: ['name', 'no_telp'],
        },
      ],
      where: {
        id_pembeli: req.userId,
      },
    });

    if (result.length > 0) {
      res.status(200).json({
        message: 'Berhasil mendapatkan transaksi',
        data: result,
      });
    } else {
      res.status(404).json({
        message: 'Data tidak ditemukan',
        data: [],
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan dalam memproses permintaan',
      error: error.message,
    });
  }
};

controller.getTransaksiById = async function (req, res) {
  try {
    const result = await model.detail_transaksi.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (result) {
      res.status(200).json({
        message: 'Berhasil mendapatkan transaksi',
        data: result,
      });
    } else {
      res.status(404).json({
        message: 'Data tidak ditemukan',
        data: [],
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan dalam memproses permintaan',
      error: error.message,
    });
  }
};

controller.getDetailTransaksi = async function (req, res) {
  try {
    const result = await model.detail_transaksi.findAll({
      where: {
        id_transaksi: req.params.id,
      },
      include: [
        {
          model: model.transaksi,
          attributes: ['status_pembayaran'],
        },
      ],
    });

    if (result) {
      res.status(200).json({
        message: 'Berhasil mendapatkan transaksi',
        data: result,
      });
    } else {
      res.status(404).json({
        message: 'Data tidak ditemukan',
        data: [],
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan dalam memproses permintaan',
      error: error.message,
    });
  }
};

controller.updateTransaksi = async function (req, res) {
  try {
    const result = await model.detail_transaksi.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (result) {
      await model.detail_transaksi.update({ status: req.body.status }, { where: { id: req.params.id } });
      res.status(200).json({
        message: 'Berhasil memperbarui transaksi',
      });
    } else {
      res.status(404).json({
        message: 'Data tidak ditemukan',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan dalam memproses permintaan',
      error: error.message,
    });
  }
};

controller.updateStatusTransaksi = async function (req, res) {
  try {
    const result = await model.transaksi.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (result) {
      await model.transaksi.update({ status_pembayaran: req.body.status }, { where: { id: req.params.id } });
      res.status(200).json({
        message: 'Berhasil memperbarui transaksi',
      });
    } else {
      res.status(404).json({
        message: 'Data tidak ditemukan',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Terjadi kesalahan dalam memproses permintaan',
      error: error.message,
    });
  }
};

controller.getOrderDetail = async function (req, res) {
  try {
    await model.order_detail
      .findAll({
        include: [
          {
            model: model.produk,
            attributes: ['nama', 'deskripsi', 'gambar'],
          },
        ],
        where: {
          user_id: req.params.userId,
        },
      })
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: 'mendapatkan data order',
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

controller.getMyOrder = async function (req, res) {
  try {
    await model.order_detail
      .findAll({
        attributes: ['id', 'user_id', 'produk_id', 'alamat', 'total', 'keterangan', 'id_penjual', 'jumlah'],
        include: [
          {
            model: model.produk,
            attributes: ['nama', 'deskripsi', 'gambar', 'telp_penjual'],
          },
        ],
        where: {
          user_id: req.userId,
        },
      })
      .then((result) => {
        if (result) {
          res.status(200).json({
            message: 'mendapatkan data order',
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

controller.addOrderDetail = async function (req, res) {
  try {
    const { user_id, id_penjual, produk_id, jumlah, alamat, keterangan, telp_pembeli, total } = req.body;

    if (!user_id || !id_penjual || !produk_id || !alamat || !total) {
      throw new Error('Semua data yang diperlukan harus disediakan');
    }

    // Cek apakah sudah ada order detail dengan kombinasi user_id, id_penjual, dan produk_id
    const existingOrderDetail = await model.order_detail.findOne({
      where: {
        user_id: user_id,
        id_penjual: id_penjual,
        produk_id: produk_id,
      },
    });

    if (existingOrderDetail) {
      // Jika ada, update totalnya
      const updatedTotal = existingOrderDetail.total + total;
      const updatedJumlah = existingOrderDetail.jumlah + jumlah;

      await existingOrderDetail.update({
        total: updatedTotal,
        jumlah: updatedJumlah,
        keterangan: keterangan, // optional, bisa disesuaikan
        alamat: alamat, // optional, bisa disesuaikan
        telp_pembeli: telp_pembeli, // optional, bisa disesuaikan
      });

      res.status(200).json({
        message: 'Detail pesanan berhasil diperbarui',
      });
    } else {
      // Jika tidak ada, buat entry baru
      await model.order_detail.create({
        user_id: user_id,
        id_penjual: id_penjual,
        produk_id: produk_id,
        jumlah: jumlah,
        keterangan: keterangan,
        alamat: alamat,
        telp_pembeli: telp_pembeli,
        total: total,
      });

      res.status(200).json({
        message: 'Berhasil menambahkan data ke order detail',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

controller.addCart = async (req, res) => {
  try {
    const { user_id, produk_id, id_penjual, jumlah, keterangan, harga, sub_total, gambar } = req.body;

    // Cek apakah produk sudah ada di keranjang
    const existingCartItem = await model.cart.findOne({
      where: {
        user_id: user_id,
        produk_id: produk_id,
      },
    });

    if (existingCartItem) {
      // Jika produk sudah ada, tambahkan jumlahnya
      const updatedJumlah = existingCartItem.jumlah + jumlah;
      const updatedSubTotal = updatedJumlah * harga; // Menghitung subtotal baru

      await existingCartItem.update({
        jumlah: updatedJumlah,
        sub_total: updatedSubTotal,
      });

      res.status(200).json({
        message: 'Jumlah produk di keranjang berhasil diperbarui',
      });
    } else {
      // Jika produk belum ada, tambahkan sebagai produk baru di keranjang
      await model.cart.create({
        user_id: user_id,
        produk_id: produk_id,
        id_penjual: id_penjual,
        jumlah: jumlah,
        keterangan: keterangan,
        harga: harga,
        sub_total: sub_total,
        gambar: gambar,
      });

      res.status(200).json({
        message: 'Berhasil menambah produk ke keranjang',
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.rejectBanner = async (req, res) => {
  try {
    await model.requested_banner.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'berhasil hapus id',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.deleteActiveBanner = async (req, res) => {
  try {
    await model.active_banner.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'berhasil hapus id',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.deleteRequestedBanner = async (req, res) => {
  try {
    await model.requested_banner.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'berhasil hapus id',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.addActiveBanner = async (req, res) => {
  try {
    const { id_user, nama_banner, gambar, status } = req.body;
    await model.active_banner.create({
      id_user: id_user,
      nama_banner: nama_banner,
      gambar: gambar,
      status: status,
    });
    await model.requested_banner.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'berhasil menambahkan data ke order detail',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.addBanner = async (req, res) => {
  try {
    // Periksa apakah ada berkas yang diunggah
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: 'Tidak ada berkas yang diunggah' });
    }

    const { id_user, nama_banner, deskripsi, status } = req.body;
    const { gambar, bukti_transfer } = req.files;

    // Pastikan jenis file yang diunggah adalah gambar
    const allowedTypes = ['.png', '.jpg', '.jpeg'];
    if (!allowedTypes.includes(path.extname(gambar.name).toLowerCase())) {
      return res.status(422).json({ msg: 'Gambar tidak valid' });
    }

    // Pastikan ukuran gambar tidak melebihi 5 MB
    const gambarSize = gambar.size;
    if (gambarSize > 5000000) {
      return res.status(422).json({ msg: 'Ukuran gambar harus kurang dari 5 MB' });
    }

    // Simpan gambar
    const gambarName = gambar.md5 + path.extname(gambar.name);
    const gambarUrl = `${req.protocol}://${req.get('host')}/images/${gambarName}`;
    await gambar.mv(`./public/images/${gambarName}`);

    // Pastikan jenis file yang diunggah untuk bukti transfer adalah gambar
    if (!allowedTypes.includes(path.extname(bukti_transfer.name).toLowerCase())) {
      return res.status(422).json({ msg: 'Bukti transfer tidak valid' });
    }

    // Pastikan ukuran bukti transfer tidak melebihi 5 MB
    const buktiTransferSize = bukti_transfer.size;
    if (buktiTransferSize > 5000000) {
      return res.status(422).json({ msg: 'Ukuran bukti transfer harus kurang dari 5 MB' });
    }

    // Simpan bukti transfer
    const buktiTransferName = bukti_transfer.md5 + path.extname(bukti_transfer.name);
    const buktiTransferUrl = `${req.protocol}://${req.get('host')}/images/${buktiTransferName}`;
    await bukti_transfer.mv(`./public/images/${buktiTransferName}`);

    // Buat banner dengan menyertakan URL gambar dan bukti transfer
    await model.requested_banner.create({
      id_user,
      nama_banner,
      deskripsi,
      gambar: gambarUrl,
      bukti_transfer: buktiTransferUrl,
      status,
    });

    res.redirect('/seller/upload-banner');
  } catch (error) {
    console.error('Error saat menambahkan banner:', error);
    return res.status(500).json({ msg: 'Terjadi kesalahan saat menambahkan banner' });
  }
};

controller.deleteCart = async function (req, res) {
  try {
    await model.cart.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'berhasil hapus id',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.deleteOrderDetail = async function (req, res) {
  try {
    await model.order_detail.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      message: 'berhasil hapus id',
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

controller.deleteAllCartItems = async function (req, res) {
  try {
    await model.cart.destroy({
      where: {
        user_id: req.userId,
      },
    });
    res.status(200).json({
      message: 'Berhasil menghapus semua item dari keranjang',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

controller.deleteAllOrderItems = async function (req, res) {
  try {
    await model.order_detail.destroy({
      where: {
        user_id: req.userId,
      },
    });
    res.status(200).json({
      message: 'Berhasil menghapus semua item dari keranjang',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

controller.checkout = async function (req, res) {
  //checkout
  // try {
  //     const { id, id_penjual,} = req.body;
  //     await model.produk.create({
  //         id_penjual: id_penjual,
  //         id_kategori: id_kategori,
  //         konten: konten,
  //         nama: nama,
  //         gambar: gambar,
  //         deskripsi: deskripsi,
  //         rate: rate,
  //         harga
  //     });
  //     //   res.redirect("/dosen/courses");
  //   } catch (error) {
  //     res.json({ message: error.message });
  //     // res.redirect("/dosen/add-course");
  // }
};

// controller.tampilProduk= async function(req, res){
//     const ekomers = await model.produk.findAll({
//         attributes: ['id', 'name']
//     });
//     res.json("rpsadmin", { kurikulum ,dasbordaktif: "", rpsaktif: "active" });
// }

module.exports = controller;
