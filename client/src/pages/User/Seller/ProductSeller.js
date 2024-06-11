import SellerNavbar from '../../../components/SellerNavbar';
import SidebarSeller from '../../../components/SidebarSeller';
import Table from 'react-bootstrap/Table';
import React, { useState, useEffect, useRef } from 'react';
import { MDBCol, MDBBtn, MDBRow, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import axios from 'axios';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../features/authSlice';

const ProductSeller = () => {
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

  const [marketplace, setMarketplace] = useState([]);
  const [produkDetail, setProdukDetail] = useState('');
  const [scrollableModal, setScrollableModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef(null);

  const [nama, setNama] = useState('');
  const [stok, setStok] = useState(0);
  const [harga, setHarga] = useState(0);
  const [deskripsi, setDeskripsi] = useState('');
  const [file, setFile] = useState('');

  useEffect(() => {
    getMarketplace();
  }, []);

  const getMarketplace = async () => {
    try {
      const response = await axios.get('http://${url}/marketplace/produksaya/dashboard');
      setMarketplace(response.data.data);
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    }
  };
  const loadProdukDetail = async (id) => {
    try {
      const response = await axios.get(`http://${url}/marketplace/${id}/produk`);

      if (!response.data || !response.data.items || response.data.items.length === 0) {
        throw new Error('Data produk tidak tersedia');
      }

      const produkData = response.data.items;
      setProdukDetail(produkData);
      console.log(produkData);

      setNama(produkData.nama);
      setStok(produkData.stok);
      setHarga(produkData.harga);
      setDeskripsi(produkData.deskripsi);

      setScrollableModal(true);
      setIsEditMode(true);
    } catch (error) {
      console.error('Terjadi kesalahan saat memuat detail produk:', error);
      swal('Error', 'Gagal memuat detail produk. Silakan coba lagi nanti.', 'error');
    }
  };

  const deleteProduk = async (id) => {
    try {
      swal({
        title: 'Anda yakin?',
        text: 'Anda tidak akan dapat mengembalikan produk ini!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await axios.delete(`http://${url}/marketplace/deleteProduk/${id}`);
          getMarketplace();
          swal('Produk berhasil dihapus!', {
            icon: 'success',
          });
        } else {
          swal('Produk Anda tidak jadi dihapus!');
        }
      });
    } catch (error) {
      console.error('Error deleting produk:', error);
    }
  };

  const updateProduk = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('stok', stok);
    formData.append('harga', harga);
    formData.append('deskripsi', deskripsi);
    formData.append('file', file);

    try {
      await axios.put(`http://${url}/marketplace/updateProduk/${produkDetail.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      swal({
        icon: 'success',
        title: 'Success',
        text: 'Produk berhasil di update!',
      }).then(() => {
        setScrollableModal(false);
        getMarketplace();
        setFile(''); // Reset file state
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <SellerNavbar />
      <div className="main">
        <SidebarSeller />
        <div className="container mt-5">
          <MDBRow className="mt-5">
            <h5 style={{ color: '#A08336' }}>Produk Saya</h5>
            <MDBCol size="2" className="mt-3">
              <a href="upload-produk" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', display: 'inline-block' }}>
                Tambah
              </a>
            </MDBCol>
            <MDBRow className="mt-3 justify-content-center">
              <MDBCol md={12} xs={2} className="ms-auto">
                <MDBCard>
                  <MDBCardBody>
                    <div className="row">
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Produk ID</th>
                            <th>Nama Produk</th>
                            <th>Stok</th>
                            <th>Harga</th>
                            <th>Deskripsi</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(marketplace) &&
                            marketplace.map((item) => (
                              <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.nama}</td>
                                <td>{item.stok}</td>
                                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga)}</td>
                                <td>{item.deskripsi}</td>
                                <td>
                                  <i className="bi bi-trash-fill" onClick={() => deleteProduk(item.id)} style={{ color: '#A08336', paddingRight: '10px', cursor: 'pointer' }}></i>
                                  <i className="bi bi-pencil-square" onClick={() => loadProdukDetail(item.id)} style={{ color: '#A08336', paddingRight: '10px', cursor: 'pointer' }}></i>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBRow>
        </div>
      </div>
      <MDBModal open={scrollableModal} setOpen={setScrollableModal} tabIndex="-1">
        <MDBModalDialog centered scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit Produk</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setScrollableModal(!scrollableModal)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBRow className="justify-content-center">
                <section className="isiblog">
                  <form onSubmit={updateProduk}>
                    <div className="mb-3">
                      <label htmlFor="nama" className="form-label">
                        Nama Produk
                      </label>
                      <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="form-control" id="nama" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="stok" className="form-label">
                        Stok
                      </label>
                      <input type="number" value={stok} onChange={(e) => setStok(Math.max(0, e.target.value))} className="form-control" id="stok" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="harga" className="form-label">
                        Harga
                      </label>
                      <input type="number" value={harga} onChange={(e) => setHarga(e.target.value)} className="form-control" id="harga" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="file" className="form-label">
                        Edit Gambar
                      </label>
                      <div className="mb-3">
                        <img src={produkDetail.gambar} className="hover-shadow" alt="" style={{ width: '50%' }} />
                      </div>
                      <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} className="form-control" id="file" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="deskripsi" className="form-label">
                        Deskripsi
                      </label>
                      <input type="text" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="form-control" id="deskripsi" />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Simpan Perubahan
                    </button>
                  </form>
                </section>
              </MDBRow>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default ProductSeller;
