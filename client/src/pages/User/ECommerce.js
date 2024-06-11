import React, { Component } from 'react';
import EcomNavbar from '../../components/EcomNavbar';
import Footer from '../../components/Footer';
import { MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import LandingEcom from '../../components/LandingEcom';
export default class Landing extends Component {
  render() {
    return (
      <div>
        <EcomNavbar />
        <MDBContainer>
          <MDBRow className="mt-3 justify-content-center">
            <MDBCol md={6} xs={12} className="mb-3">
              <img src="/img/iklan.png" className="hover-shadow" alt="" style={{ width: '100%' }} />
            </MDBCol>
            <MDBCol md={6} xs={12}>
              <img src="/img/iklan (3).png" className="hover-shadow" alt="" style={{ width: '100%' }} />
            </MDBCol>
            <MDBCol size="12 mt-5" style={{ backgroundColor: 'white', padding: '15px' }}>
              <div className="row justify-content-center">
                <div className="col-auto align-items-center" style={{ margin: '10px' }}>
                  <a href={`kategori-ecom/${1}`} data-toggle="collapse" data-target=".forum-content" style={{ color: 'black', textDecoration: 'none', fontSize: '14px' }}>
                    <img src="/img/kategori (1).png" width="75" alt="User 1" />
                  </a>
                </div>
                <div className="col-auto align-items-center" style={{ margin: '10px' }}>
                  <a href={`kategori-ecom/${2}`} data-toggle="collapse" data-target=".forum-content" style={{ color: 'black', textDecoration: 'none', fontSize: '14px' }}>
                    <img src="/img/kategori (2).png" width="75" alt="User 2" />
                  </a>
                </div>
                <div className="col-auto align-items-center" style={{ margin: '10px' }}>
                  <a href={`kategori-ecom/${3}`} data-toggle="collapse" data-target=".forum-content" style={{ color: 'black', textDecoration: 'none', fontSize: '14px' }}>
                    <img src="/img/kategori (3).png" width="75" alt="User 3" />
                  </a>
                </div>
                <div className="col-auto align-items-center" style={{ margin: '10px' }}>
                  <a href={`kategori-ecom/${4}`} data-toggle="collapse" data-target=".forum-content" style={{ color: 'black', textDecoration: 'none', fontSize: '14px' }}>
                    <img src="/img/kategori (4).png" width="75" alt="User 4" />
                  </a>
                </div>
                <div className="col-auto align-items-center" style={{ margin: '10px' }}>
                  <a href={`kategori-ecom/${5}`} data-toggle="collapse" data-target=".forum-content" style={{ color: 'black', textDecoration: 'none', fontSize: '14px' }}>
                    <img src="/img/kategori (5).png" width="75" alt="User 5" />
                  </a>
                </div>
                <div className="col-auto align-items-center" style={{ margin: '10px' }}>
                  <a href={`kategori-ecom/${6}`} data-toggle="collapse" data-target=".forum-content" style={{ color: 'black', textDecoration: 'none', fontSize: '14px' }}>
                    <img src="/img/kategori (6).png" width="75" alt="User 6" />
                  </a>
                </div>
                <div className="col-auto align-items-center" style={{ margin: '10px' }}>
                  <a href={`kategori-ecom/${7}`} data-toggle="collapse" data-target=".forum-content" style={{ color: 'black', textDecoration: 'none', fontSize: '14px' }}>
                    <img src="/img/kategori (7).png" width="75" alt="User 7" />
                  </a>
                </div>
                <div className="col-auto align-items-center" style={{ margin: '10px' }}>
                  <a href={`kategori-ecom/${8}`} data-toggle="collapse" data-target=".forum-content" style={{ color: 'black', textDecoration: 'none', fontSize: '14px' }}>
                    <img src="/img/kategori (8).png" width="75" alt="User 8" />
                  </a>
                </div>
              </div>
            </MDBCol>
            <LandingEcom />
          </MDBRow>
        </MDBContainer>
        <br></br>
        <br></br>
        <br></br>
        <Footer />
      </div>
    );
  }
}
