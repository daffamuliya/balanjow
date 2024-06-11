import React, { useEffect, useState } from 'react';
import NormalNavbar from '../../components/NormalNavbar';
import Footer from '../../components/Footer';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage } from 'mdb-react-ui-kit';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import RekomendasiEcom from '../../components/RecomendasiEcom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';

const DetailProduk = () => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [keterangan, setKeterangan] = useState('');

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);
  const user_id = user ? user.id : null;

  const handleQuantity = () => {
    if (quantity <= 1) {
      return setQuantity(quantity + 0);
    } else {
      setQuantity(quantity - 1);
    }
  };

  const { id } = useParams();
  const [produk, setProduk] = useState(null);
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const response = await axios.get(`http://${url}/marketplace/${id}/produk`);
        if (response.data.items) {
          const fetchedProduk = response.data.items;
          localStorage.setItem('savedProduk', JSON.stringify(fetchedProduk));
          setProduk(fetchedProduk);
        } else {
          console.error('Respon dari server tidak sesuai');
        }
      } catch (error) {
        console.error('Kesalahan saat mengambil data produk:', error);
      }
    };

    fetchProduk();

    return () => {
      if (produk) {
        localStorage.removeItem('savedProduk');
      }
    };
  }, [id, produk]);

  const addToCart = async () => {
    if (!user) {
      swal({
        icon: 'warning',
        title: 'Oops!',
        text: 'Anda belum login. Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.',
      });
      return;
    }

    const cartItem = {
      user_id: user_id,
      produk_id: produk.id,
      id_penjual: produk.id_penjual,
      jumlah: quantity,
      keterangan: keterangan,
      harga: produk.harga,
      sub_total: quantity * produk.harga,
      gambar: produk.gambar,
    };

    try {
      const response = await axios.post(`http://${url}/marketplace/cart/addCart`, cartItem);

      if (response.status === 200) {
        swal({
          icon: 'success',
          title: 'Success',
          text: 'Produk berhasil ditambahkan ke keranjang!',
        }).then(() => {
          navigate('/cart');
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

  if (produk) {
    return (
      <div>
        <NormalNavbar />
        <MDBContainer>
          <MDBRow className="mt-3 justify-content-center">
            <MDBCol md={12} className="mb-4">
              <MDBCard>
                <MDBCardBody className="d-md-flex justify-content-between align-items-center">
                  <MDBCol md={6} className="mb-md-0">
                    <MDBCardImage src={produk.gambar} position="top" alt="..." />
                  </MDBCol>
                  <MDBCol md={6} className="ms-md-3 mt-3 mt-md-0">
                    <div>
                      <MDBCardTitle style={{ fontSize: '28px', fontWeight: 'bold' }}>{produk.nama}</MDBCardTitle>
                      <MDBCardText style={{ color: '#2D2D2D', fontSize: '16px', opacity: '60%', paddingRight: '5px' }}>{produk.deskripsi}</MDBCardText>
                      <MDBCardTitle style={{ fontSize: '22px', fontWeight: 'bold' }}>Rp{produk.harga}</MDBCardTitle>
                      <hr className="my-4 me-4" />
                      <div className="mb-3 me-4">
                        <label htmlFor="keterangan" className="form-label">
                          Keterangan
                        </label>
                        <input type="text" className="form-control" id="judul" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} />
                      </div>
                      <div className="input-group mb-3 me-4" style={{ paddingRight: '20px' }}>
                        <button className="btn btn-secondary" type="button" onClick={handleQuantity} style={{ backgroundColor: '#fff', border: '1px solid #ccc', color: 'black' }}>
                          -
                        </button>
                        <input type="text" className="form-control text-center font-weight-bold" name="quantity" value={quantity} placeholder={quantity} disabled style={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                        <button className="btn btn-secondary" type="button" onClick={() => setQuantity(quantity + 1)} style={{ backgroundColor: '#fff', border: '1px solid #ccc', color: 'black' }}>
                          +
                        </button>
                      </div>
                      <div className="mb-3 me-4">
                        {user ? (
                          <button className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', textAlign: 'center', border: 'black', width: '100%' }} onClick={addToCart}>
                            Tambah Keranjang
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            style={{ backgroundColor: '#A08336', fontSize: '16px', textAlign: 'center', border: 'black', width: '100%' }}
                            onClick={() =>
                              swal({
                                icon: 'warning',
                                title: 'Oops!',
                                text: 'Anda belum login. Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.',
                              })
                            }
                          >
                            Tambah Keranjang
                          </button>
                        )}
                      </div>
                    </div>
                  </MDBCol>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <RekomendasiEcom />
          </MDBRow>
        </MDBContainer>
        <br></br>
        <br></br>
        <br></br>
        <Footer />
      </div>
    );
  } else {
    return <div>Loading..</div>;
  }
};

export default DetailProduk;
