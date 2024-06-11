import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NormalNavbar from '../../components/NormalNavbar';
import Footer from '../../components/Footer';
import { MDBContainer, MDBRow, MDBBtn, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';

const KategoriEcom = () => {
  const [marketplace, setMarketplace] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMarketplace = async () => {
      try {
        const response = await axios.get(`http://${url}/marketplace/${id}`);
        setMarketplace(response.data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getMarketplace();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <NormalNavbar />
      <MDBContainer>
        <MDBRow className="pt-5 mb-5">
          {Array.isArray(marketplace) && marketplace.length > 0 ? (
            marketplace.map((item) => (
              <MDBCol key={item.id} md={3} xs={12} className="mt-3">
                <MDBCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '28px', border: 'none', maxWidth: '352px', Height: '444px' }} className="text-center">
                  <MDBCardImage src={item.gambar} position="top" alt="..." />
                  <MDBCardBody>
                    <MDBCardText className="mb-3" style={{ color: '#8D8D8D' }}>
                      {item.kategori_produk.nama}
                    </MDBCardText>
                    <MDBCardTitle style={{ fontSize: '20px', fontWeight: 'bold' }} className="text-center">
                      {item.nama}
                    </MDBCardTitle>
                    <MDBCardText className="mt-3" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga)}
                    </MDBCardText>
                    <MDBBtn
                      href={`/detail-produk/${item.id}`}
                      className="mb-3 mt-2"
                      size="lg"
                      style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '169px', maxHeight: '42px', fontWeight: 'normal', textAlign: 'center', border: '#A08336', borderRadius: '10px' }}
                    >
                      Selengkapnya
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))
          ) : (
            <MDBCol size="12" className="text-center mt-5">
              <p>No products found in this category.</p>
            </MDBCol>
          )}
        </MDBRow>
      </MDBContainer>
      <Footer />
    </div>
  );
};

export default KategoriEcom;
