import React, { useState, useEffect } from 'react';
import SellerNavbar from '../../../components/SellerNavbar';
import SidebarSeller from '../../../components/SidebarSeller';
import CardBody from 'react-bootstrap/esm/CardBody';
import Card from 'react-bootstrap/Card';
import { MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../../features/authSlice';

const TambahBanner = () => {
  const { user } = useSelector((state) => state.auth);
  const id_user = user ? user.id : null;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);

  const [status] = useState('Diajukan');
  const [nama_banner, setNamaBanner] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [gambar, setGambar] = useState(null);
  const [bukti_transfer, setBuktiTransfer] = useState(null);
  const url = process.env.REACT_APP_BASE_URL;

  const loadImage = (e) => {
    if (e.target.name === 'gambar') {
      setGambar(e.target.files[0]);
    } else if (e.target.name === 'bukti_transfer') {
      setBuktiTransfer(e.target.files[0]);
    }
  };

  const saveBanner = async (e) => {
    e.preventDefault();

    if (!gambar || !bukti_transfer) {
      swal({
        icon: 'error',
        title: 'Gagal',
        text: 'Silakan pilih gambar dan bukti transfer.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('id_user', id_user);
    formData.append('nama_banner', nama_banner);
    formData.append('deskripsi', deskripsi);
    formData.append('gambar', gambar);
    formData.append('bukti_transfer', bukti_transfer);
    formData.append('status', status);

    try {
      const response = await axios.post(`${url}/marketplace/banner/addBanner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        swal({
          icon: 'success',
          title: 'Sukses',
          text: 'Banner berhasil diunggah!',
        }).then(() => {
          navigate('/seller/daftar-banner');
        });
      } else {
        throw new Error('Gagal mengunggah banner');
      }
    } catch (error) {
      console.log(error);
      swal({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengunggah banner. Silakan coba lagi.',
      });
    }
  };

  return (
    <div>
      <SellerNavbar />
      <div className="main">
        <SidebarSeller />
        <div className="container mt-5">
          <h5 className="title" style={{ color: '#A08336' }}>
            Requested Banner
          </h5>
          <MDBCol size="2" className="mt-3 mb-3">
            <a href="upload-produk" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', display: 'inline-block' }}>
              Tambah
            </a>
          </MDBCol>
          <Card>
            <CardBody>
              <div className="row">
                <div className="col-12 mb-4 mt-4">
                  <form onSubmit={saveBanner}>
                    <div className="mb-3">
                      <label htmlFor="nama_banner" className="form-label">
                        Nama Banner
                      </label>
                      <input type="text" value={nama_banner} onChange={(e) => setNamaBanner(e.target.value)} className="form-control" id="nama_banner" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="deskripsi" className="form-label">
                        Deskripsi Banner Anda
                      </label>
                      <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="form-control" id="deskripsi" required></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="gambar" className="form-label">
                        Upload Gambar Banner (Ukuran 615px*234px)
                      </label>
                      <input type="file" onChange={loadImage} className="form-control" id="gambar" name="gambar" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="bukti_transfer" className="form-label">
                        Bukti Transfer
                      </label>
                      <input type="file" onChange={loadImage} className="form-control" id="bukti_transfer" name="bukti_transfer" required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', float: 'right' }}>
                      Ajukan
                    </button>
                    <div className="mb-3">
                      <label htmlFor="note" className="form-label" style={{ fontSize: '14px' }}>
                        *Banner yang diajukan akan melalui proses review oleh admin, sebelum akhirnya diterbitkan di halaman awal e-commerce.
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
