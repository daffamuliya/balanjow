import React from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn, MDBRow, MDBCol, MDBContainer } from 'mdb-react-ui-kit';
const Features = () => {
  return (
    <section className="features">
      <div className="container px-4 px-lg-5 h-100">
        <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
          <div className="col-lg-12  align-self-end mt-5 pt-5">
            <p class="text-white-75" style={{ color: '#8A898E', fontSize: '18px' }}>
              What we do
            </p>
            <h1 className="text-black font-weight-bold" style={{ color: 'black', fontSize: '52px', fontWeight: 'bold' }}>
              We've Got 3 Features!
            </h1>
          </div>
        </div>
      </div>
      <MDBContainer>
        <MDBRow className="mt-5 pt-5">
          <MDBCol md={4} xs={8} className="mb-3">
            <MDBCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '28px', border: 'none', maxWidth: '352px', Height: '444px' }} className="text-center">
              <MDBCardImage src="/img/forum.png" className="mx-auto mt-5" alt="..." style={{ width: '30%' }} />
              <MDBCardBody>
                <MDBCardTitle style={{ fontSize: '36px', fontWeight: 'bold' }} className="text-center">
                  Forum
                </MDBCardTitle>
                <MDBCardText className="mt-3 mb-3">Fitur untuk berdiskusi, sekaligus memamerkan kreativitas.</MDBCardText>
                <MDBBtn
                  href="/forum"
                  className="mt-5 mb-3"
                  size="lg"
                  style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '169px', maxHeight: '42px', fontWeight: 'normal', textAlign: 'center', border: '#A08336', borderRadius: '10px' }}
                >
                  Selengkapnya
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md={4} xs={8} className="mb-3">
            <MDBCard alignment="center" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '28px', border: 'none', maxWidth: '352px', Height: '444px' }}>
              <MDBCardImage src="/img/blog.png" className="mx-auto mt-5" position="center" alt="..." style={{ width: '28%' }} />
              <MDBCardBody>
                <MDBCardTitle style={{ fontSize: '36px', fontWeight: 'bold' }} className="text-center">
                  Blog
                </MDBCardTitle>
                <MDBCardText className="mt-3 mb-3">Fitur untuk saling membantu, melalui tulisan yang dimuat.</MDBCardText>
                <MDBBtn
                  href="/blog"
                  className="mt-5 mb-3"
                  size="lg"
                  style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '169px', maxHeight: '42px', fontWeight: 'normal', textAlign: 'center', border: '#A08336', borderRadius: '10px' }}
                >
                  Selengkapnya
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md={4} xs={8} className="mb-3">
            <MDBCard alignment="center" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '28px', border: 'none', maxWidth: '352px', Height: '444px' }}>
              <MDBCardImage src="/img/ecommerce.png" className="mx-auto mt-5" position="center" alt="..." style={{ width: '30%' }} />
              <MDBCardBody>
                <MDBCardTitle style={{ fontSize: '36px', fontWeight: 'bold' }} className="text-center">
                  E-Commerce
                </MDBCardTitle>
                <MDBCardText className="mt-3 mb-3">Membantu menemukan serta memperluas pasar usaha mahasiswa.</MDBCardText>
                <MDBBtn
                  href="/ecommerce"
                  className="mt-5 mb-3"
                  size="lg"
                  style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '169px', maxHeight: '42px', fontWeight: 'normal', textAlign: 'center', border: '#A08336', borderRadius: '10px' }}
                >
                  Selengkapnya
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default Features;
