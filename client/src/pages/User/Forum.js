import React, { Component } from 'react';
import NormalNavbar from '../../components/NormalNavbar';
import Footer from '../../components/Footer';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import LandingSocial from '../../components/LandingForum';

export default class Landing extends Component {
  render() {
    return (
      <div>
        <NormalNavbar />
        <MDBContainer>
          <MDBRow className="mt-3 justify-content-center">
            <MDBCol md={12} xs={2} className="ms-auto">
              <img src="/img/banner-forum.png" className="hover-shadow" alt="" style={{ width: '100%' }} />
            </MDBCol>
            <LandingSocial />
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
