import React, { useState, useEffect } from 'react';
import NormalNavbar from '../../components/NormalNavbar';
import Footer from '../../components/Footer';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';
import { MDBContainer, MDBRow, MDBCol, MDBCardBody, MDBCard, MDBCardText, MDBCardImage } from 'mdb-react-ui-kit';

export const BuktiBayar = () => {
  const url = process.env.REACT_APP_BASE_URL;
  const { user } = useSelector((state) => state.auth);
  const id_pembeli = user ? user.id : null;
  const alamat_pembeli = user ? user.alamat : null;
  const telp_pembeli = user ? user.no_telp : null;
  const [totalBayar, setTotalBayar] = useState(0);

  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const response = await axios.get(`http://${url}/marketplace/order/getMyOrder`);
      console.log(response);
      if (response.data.data) {
        const orderDetails = response.data.data;
        setOrderDetails(orderDetails);
        const totalBayar = orderDetails.reduce((acc, item) => acc + item.total, 0);
        console.log('Total Bayar:', totalBayar);
        console.log('kebabian', orderDetails);
        setTotalBayar(totalBayar);
      } else {
        console.error('Data detail pemesanan tidak ditemukan');
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data detail pemesanan:', error);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);
  const userId = user ? user.id : null;

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);

  const [total, setTotal] = useState('');
  const [payment, setPayment] = useState('');
  const [bukti_transfer, setBuktiTransfer] = useState(null);

  const loadImage = (e) => {
    const image = e.target.files[0];
    setBuktiTransfer(image);
  };

  useEffect(() => {
    if (totalBayar > 0) {
      setTotal(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalBayar));
    }
  }, [totalBayar]);

  const saveBukti = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id_pembeli', id_pembeli);
    formData.append('total', totalBayar);
    formData.append('produk', JSON.stringify(orderDetails));
    formData.append('payment', payment);
    formData.append('alamat_pembeli', alamat_pembeli);
    formData.append('telp_pembeli', telp_pembeli);
    formData.append('bukti_transfer', bukti_transfer);

    try {
      const response = await axios.post(`http://${url}/marketplace/transfer`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        swal({
          icon: 'success',
          title: 'Sukses',
          text: 'Bukti Transfer berhasil diunggah!',
        }).then(() => {
          navigate('/user/pesanan');
          deleteAllOrderItems();
        });
      } else {
        throw new Error('Gagal mengunggah bukti');
      }
    } catch (error) {
      console.log(error);
      swal({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengunggah bukti. Silakan coba lagi.',
      });
    }
  };

  const deleteAllOrderItems = async () => {
    try {
      await axios.delete(`http://${url}/marketplace/deleteAllOrderItems/${userId}`);
    } catch (error) {
      console.error('Terjadi kesalahan saat menghapus item di keranjang:', error);
    }
  };

  return (
    <div>
      <NormalNavbar />
      <MDBContainer>
        <MDBRow className="mt-3 justify-content-center">
          <MDBCol size="12">
            <h2 className="text-center mb-3 mt-3" style={{ fontWeight: 'bold', color: '#A08336' }}>
              Upload Bukti Pembayaran
            </h2>
            <MDBRow className="pt-3">
              <MDBCol md={4} xs={8} className="mt-3">
                <MDBCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', border: 'none', Width: '390px', Height: '239px' }} className="text-center">
                  <MDBCardImage src="/img/mandiri.png" className="mx-auto mt-5" alt="..." style={{ width: '30%' }} />
                  <MDBCardBody>
                    <MDBCardText className="mt-3 mb-3">PT BALANJO INDONESIA</MDBCardText>
                    <br></br>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md={4} xs={8} className="mt-3">
                <MDBCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', border: 'none', Width: '390px', Height: '239px' }} className="text-center">
                  <MDBCardImage src="/img/qris.png" className="mx-auto mt-5" alt="..." style={{ width: '30%' }} />
                  <MDBCardBody>
                    <MDBCardText className="mt-3 mb-3">PT BALANJO INDONESIA</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md={4} xs={8} className="mt-3">
                <MDBCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', border: 'none', Width: '390px', Height: '239px' }} className="text-center">
                  <MDBCardImage src="/img/bca.png" className="mx-auto mt-5" alt="..." style={{ width: '30%' }} />
                  <MDBCardBody>
                    <MDBCardText className="mt-3 mb-3">PT BALANJO INDONESIA</MDBCardText>
                    <br></br>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md={4} xs={8} className="mt-3">
                <MDBCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', border: 'none', Width: '390px', Height: '239px' }} className="text-center">
                  <MDBCardImage src="/img/dana.png" className="mx-auto mt-5" alt="..." style={{ width: '30%' }} />
                  <MDBCardBody>
                    <MDBCardText className="mt-3 mb-3">PT BALANJO INDONESIA</MDBCardText>
                    <br></br>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md={4} xs={8} className="mt-3">
                <MDBCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', border: 'none', Width: '390px', Height: '239px' }} className="text-center">
                  <MDBCardImage src="/img/shoppee.png" className="mx-auto mt-5" alt="..." style={{ width: '30%' }} />
                  <MDBCardBody>
                    <MDBCardText className="mt-3 mb-3">PT BALANJO INDONESIA</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md={4} xs={8} className="mt-3">
                <MDBCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', border: 'none', Width: '390px', Height: '239px' }} className="text-center">
                  <MDBCardImage src="/img/gopay.png" className="mx-auto mt-5" alt="..." style={{ width: '30%' }} />
                  <MDBCardBody>
                    <MDBCardText className="mt-3 mb-3">PT BALANJO INDONESIA</MDBCardText>
                    <br></br>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            <MDBCard className="mt-4">
              <MDBCardBody>
                <div className="row">
                  <div className="col-12 mb-4">
                    <h3 className="text-center mb-3 mt-3" style={{ fontWeight: 'bold' }}>
                      Informasi Pelanggan
                    </h3>
                    <form onSubmit={saveBukti}>
                      <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label" style={{ fontWeight: 'bold' }}>
                          Nominal Pembayaran
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalBayar)}
                          value={total}
                          onChange={(e) => setTotal(e.target.value)}
                          disabled
                        />
                      </div>
                      {/* <div className="mb-3">
                        <label htmlFor="keterangan" className="form-label" style={{ fontWeight: 'bold' }}>
                          Keterangan
                        </label>
                        <textarea className="form-control" id="keterangan" rows="3" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} disabled />
                      </div> */}
                      <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label" style={{ fontWeight: 'bold' }}>
                          Sumber Transfer
                        </label>
                        <select className="form-select" aria-label="Default select example" placeholder="Select size" value={payment} onChange={(e) => setPayment(e.target.value)}>
                          <option value="">Pilih Sumber</option>
                          <option value="E Wallet">E Wallet</option>
                          <option value="Transfer Bank">Transfer Bank</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="customFile" style={{ fontWeight: 'bold' }}>
                          Upload Bukti
                        </label>
                        <input type="file" onChange={loadImage} className="form-control" id="bukti_transfer" name="bukti_transfer" required />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', backgroundColor: '#A08336', fontSize: '16px', maxWidth: '180px', maxHeight: '42px', textAlign: 'center', border: 'black', float: 'right' }}>
                        Konfirmasi
                      </button>
                    </form>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default BuktiBayar;
