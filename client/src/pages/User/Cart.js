import React, { useEffect, useState } from 'react';
import NormalNavbar from '../../components/NormalNavbar';
import Footer from '../../components/Footer';
import { MDBContainer, MDBRow, MDBCol, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';

const Cart = () => {
  const url = process.env.REACT_APP_BASE_URL;
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userId = user ? user.id : null;

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    fetchCartData();
  }, []);

  async function fetchCartData() {
    try {
      const response = await axios.get(`http://${url}/marketplace/cart/myCart`);
      if (response.data.data) {
        setCartItems(response.data.data);
        console.log('Fetched cart items:', response.data.data);
      } else {
        console.error('Data keranjang tidak ditemukan');
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data keranjang:', error);
    }
  }

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
          await axios.delete(`http://${url}/marketplace/deleteCart/${id}`);
          fetchCartData();
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

  const deleteAllCartItems = async () => {
    try {
      await axios.delete(`http://${url}/marketplace/deleteAllCartItems/${userId}`);
    } catch (error) {
      console.error('Terjadi kesalahan saat menghapus item di keranjang:', error);
    }
  };

  const handleCheckout = async () => {
    for (const item of cartItems) {
      const orderData = {
        user_id: userId,
        id_penjual: item.id_penjual,
        produk_id: item.produk_id,
        jumlah: item.jumlah,
        keterangan: item.keterangan,
        alamat: user && user.alamat,
        telp_pembeli: user && user.no_telp,
        total: item.sub_total,
      };
      console.log('Order Data:', orderData);

      try {
        const response = await axios.post(`http://${url}/marketplace/addOrderDetail`, orderData);
        if (response.status === 200) {
          swal('Checkout', 'Lanjutkan ke pembayaran', 'success').then(() => {
            navigate('/detail-order');
            deleteAllCartItems();
          });
        }
      } catch (error) {
        console.error('Error saat melakukan checkout:', error);
        swal('Gagal!', 'Terjadi kesalahan saat melakukan checkout', 'error');
      }
    }
  };

  return (
    <div>
      <NormalNavbar />
      <MDBContainer>
        <MDBRow className="mt-3 justify-content-center">
          <MDBCol size="12">
            <h2 className="text-center mb-3 mt-3" style={{ fontWeight: 'bold', color: '#A08336' }}>
              Keranjang
            </h2>
            <div className="table-responsive">
              <MDBTable align="middle">
                <MDBTableHead>
                  <tr>
                    <th scope="col">Product</th>
                    <th className="text-center" scope="col">
                      Qty
                    </th>
                    <th scope="col">Price</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col">Keterangan</th>
                    <th scope="col"></th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {Array.isArray(cartItems) &&
                    cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img src={item.gambar} alt="" style={{ width: '100px', height: '100px' }} />
                            <div className="ms-3">
                              <p className="fw-bold mb-1">{item.produk.nama}</p>
                              <p className="text-muted mb-0">{item.produk.deskripsi}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <p className="fw-normal mb-1">{item.jumlah}</p>
                        </td>

                        <td>
                          <p className="fw-normal mb-1">Rp{item.harga}</p>
                        </td>
                        <td>
                          <p className="fw-normal mb-1">Rp{item.sub_total}</p>
                        </td>
                        <td className="text-center">
                          <p className="fw-normal mb-1">{item.keterangan}</p>
                        </td>
                        <td>
                          <i className="bi bi-trash-fill" onClick={() => deleteProduk(item.id)} style={{ color: '#A08336', paddingRight: '10px', cursor: 'pointer' }}></i>
                        </td>
                      </tr>
                    ))}
                </MDBTableBody>
              </MDBTable>
            </div>
          </MDBCol>
          <MDBCol size="12" className="mt-3 text-end">
            <button onClick={handleCheckout} className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', display: 'inline-block' }}>
              CHECKOUT
            </button>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
};

export default Cart;
