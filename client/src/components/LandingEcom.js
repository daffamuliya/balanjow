import { MDBContainer, MDBRow, MDBBtn, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBInput } from 'mdb-react-ui-kit';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LandingEcom = () => {
  const [marketplace, setMarketplace] = useState([]);
  const [search, setSearch] = useState('');
  const url = process.env.url;

  const filteredMarketplace = marketplace.filter((item) => item.nama.toLowerCase().includes(search.toLowerCase()) || item.kategori_produk.nama.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    getMarketplace();
  }, []);

  const getMarketplace = async () => {
    const response = await axios.get(`${url}/marketplace`);
    setMarketplace(response.data.items);
  };

  return (
    <section className="landingecommerce">
      <MDBContainer>
        <MDBRow className="pt-5 mb-5">
          <MDBCol size="12">
            <form className="d-flex">
              <MDBInput
                onChange={(e) => setSearch(e.target.value)}
                wrapperClass="mb-4 w-100"
                id="formControlLg"
                type="email"
                size="lg"
                style={{ fontSize: '16px' }}
                placeholder="Search for products..."
                className="focus-ring focus-ring-light "
                autoComplete="new-password"
              />
            </form>
          </MDBCol>

          {Array.isArray(filteredMarketplace) &&
            filteredMarketplace.map((item) => (
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
                      href={`detail-produk/${item.id}`}
                      className="mb-3 mt-2"
                      size="lg"
                      style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '169px', maxHeight: '42px', fontWeight: 'normal', textAlign: 'center', border: '#A08336', borderRadius: '10px' }}
                    >
                      Selengkapnya
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default LandingEcom;
