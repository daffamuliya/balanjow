import React, { useState, useEffect } from 'react';
import NormalNavbar from '../../../components/NormalNavbar';
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Card from 'react-bootstrap/Card';
import SidebarSeller from '../../../components/SidebarSeller';
import axios from 'axios';
import swal from 'sweetalert';
import CardBody from 'react-bootstrap/esm/CardBody';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../features/authSlice';

const UploadProduk = () => {
  const { user } = useSelector((state) => state.auth);
  const id_penjual = user ? user.id : null;
  const telp_penjual = user ? user.no_telp : null;

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
    formData.append('telp_penjual', telp_penjual);
    formData.append('id_kategori', id_kategori);
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    formData.append('file', file);
    formData.append('harga', harga);
    formData.append('stok', stok);

    try {
      const response = await axios.post('http://${url}/marketplace/addProduk', formData, {
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
      <NormalNavbar />
      <div className="main">
        <SidebarSeller />
        <div className="container">
          <MDBRow className="mt-5">
            <h5 style={{ color: '#A08336' }}>Tambah Produk</h5>
            <MDBRow className="mt-3 justify-content-center">
              <MDBCol md={12} xs={2} className="ms-auto">
                <Card>
                  <CardBody>
                    {' '}
                    <div class="row">
                      <div class="col-12 mb-4 mt-4">
                        <form onSubmit={saveProduk}>
                          <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">
                              Nama Produk*
                            </label>
                            <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />
                          </div>
                          <div className="mb-3 ">
                            <label htmlFor="exampleInputPassword1" className="form-label">
                              Kategori Produk*
                            </label>
                            <select className="form-select" aria-label="Default select example" placeholder="Select size" required value={id_kategori} onChange={(e) => setKategori(e.target.value)}>
                              <option selected>Pilih Kategori Produk</option>
                              <option value="1">Aksesoris</option>
                              <option value="2">Pakaian</option>
                              <option value="3">Makanan</option>
                              <option value="4">Minuman</option>
                              <option value="5">Herbal</option>
                              <option value="6">Kreatif</option>
                              <option value="7">Jasa</option>
                              <option value="8">Lainnya</option>
                            </select>
                          </div>
                          <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">
                              Deskripsi*
                            </label>
                            <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} class="form-control" id="floatingTextarea" required></textarea>
                          </div>
                          <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">
                              Stok (Input angka)*
                            </label>
                            <input type="number" value={stok} onChange={(e) => setStok(e.target.value)} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />
                          </div>

                          <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">
                              Harga (Input angka)*
                            </label>
                            <input type="number" value={harga} onChange={(e) => setHarga(e.target.value)} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required />
                          </div>

                          <div class="mb-3">
                            <label class="form-label" for="customFile">
                              Foto*
                            </label>
                            <input type="file" onChange={loadImage} class="form-control" id="customFile" required />
                          </div>
                          <button type="submit" class="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', float: 'right' }}>
                            + Tambah
                          </button>
                        </form>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </MDBCol>
            </MDBRow>
          </MDBRow>
        </div>
      </div>
    </div>
  );
};

export default UploadProduk;
