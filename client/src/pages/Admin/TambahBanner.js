import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import Card from 'react-bootstrap/Card';
import Sidebar from '../../components/Sidebar';
import CardBody from 'react-bootstrap/esm/CardBody';
import { MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../features/authSlice';
import swal from 'sweetalert';

const TambahBanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);
  const url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);
  const [id_penjual] = useState('2');
  const [id_kategori, setKategori] = useState('');
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [file, setFile] = useState('');

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
  };

  useEffect(() => {}, []);

  const saveProduk = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id_penjual', id_penjual);
    formData.append('id_kategori', id_kategori);
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    formData.append('file', file);
    formData.append('harga', harga);
    formData.append('stok', stok);

    try {
      const response = await axios.post(`${url}/marketplace/addProduk`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        swal({
          icon: 'success',
          title: 'Success',
          text: 'Produk berhasil di upload!',
        }).then(() => {
          navigate('/seller/product');
        });
      } else {
        throw new Error('Gagal mengunggah produk');
      }
    } catch (error) {
      console.log(error);
      swal({
        icon: 'error',
        title: 'Error',
        text: 'Gagal mengunggah produk. Silakan coba lagi.',
      });
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="main">
        <Sidebar />
        <div className="container mt-5">
          <h5 className="title" style={{ color: '#A08336' }}>
            Requested Banner
          </h5>
          <MDBCol size="2" className="mt-3 mb-3">
            <a href="upload-produk" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', display: 'inline-block' }}>
              + Tambah
            </a>
          </MDBCol>
          <Card>
            <CardBody>
              {' '}
              <div class="row">
                <div class="col-12 mb-4 mt-4">
                  <form onSubmit={saveProduk}>
                    <div class="mb-3">
                      <label for="exampleInputEmail1" class="form-label">
                        Nama Banner
                      </label>
                      <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />
                    </div>
                    <div class="mb-3">
                      <label for="exampleInputPassword1" class="form-label">
                        Deskripsi Banner Anda
                      </label>
                      <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} class="form-control" id="floatingTextarea" required></textarea>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="customFile">
                        Upload Gambar Banner (Ukuran 15mmx15mm)
                      </label>
                      <input type="file" onChange={loadImage} class="form-control" id="customFile" required />
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="customFile">
                        Bukti Transfer
                      </label>
                      <input type="file" onChange={loadImage} class="form-control" id="customFile" required />
                    </div>
                    <button type="submit" class="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', float: 'right' }}>
                      Ajukan
                    </button>
                    <div class="mb-3">
                      <label for="exampleInputEmail1" class="form-label" style={{ fontSize: '14px' }}>
                        *Banner yang diajukan akan melalui proses review oleh admin, sebelum akhirnya di terbitkan di halaman awal e commerce.
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TambahBanner;
