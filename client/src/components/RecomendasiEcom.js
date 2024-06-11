import { MDBContainer, MDBRow, MDBBtn, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RekomendasiEcom = () => {
  const [marketplace, setMarketplace] = useState([]);
  const url = process.env.url;

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
          {Array.isArray(marketplace) &&
            marketplace.map((item) => (
              <MDBCol key={item.id} md={3} xs={12} className="mt-3">
                <MDBCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '28px', border: 'none', maxWidth: '352px', Height: '444px' }} className="text-center">
                  <MDBCardImage src={item.gambar} position="top" alt="..." />
                  <MDBCardBody>
                    <MDBCardText className="mb-3" style={{ color: '#8D8D8D' }}>
                      {/* {item.id_kategori} */}
                    </MDBCardText>
                    <MDBCardTitle style={{ fontSize: '20px', fontWeight: 'bold' }} className="text-center">
                      {item.nama}
                    </MDBCardTitle>
                    <MDBCardText className="mt-3" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      Rp{item.harga}
                    </MDBCardText>
                    <MDBBtn
                      href={`${item.id}`}
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

export default RekomendasiEcom;
