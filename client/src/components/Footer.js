import { MDBFooter, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';

const Footer = () => {
  return (
    <MDBFooter style={{ backgroundColor: '#F5F5F5' }} className="text-left text-lg-left">
      <MDBContainer>
        <MDBRow>
          <MDBCol lg="8" md="12" className="d-flex mb-4 mb-md-0">
            <img src="/img/logo.png" width="63" height="63" className="d-inline-block align-top" alt="React Bootstrap logo" />
            <p className='mt-3'>© 2024 Balanjo. All rights reserved.</p>
          </MDBCol>

          <MDBCol lg="4" md="12" className="d-flex mb-4 mb-md-0 ">
            <p className="me-4">Home </p>
            <p className="me-4">Forum </p>
            <p className="me-4">Blog </p>
            <p className="me-4">ECommerce </p>
            <p className="me-4">Login </p>
          </MDBCol>
        </MDBRow>
        <hr className="my-4" />
        <div className="p-2 text-left" style={{ backgroundColor: '#F5F5F5' }}>
          <a className="text-dark text-left" href="https://mdbootstrap.com/" style={{ color: '#151439', textDecoration: 'none' }}>
            Inovasi untuk rangers
          </a>
        </div>
        <br></br>
      </MDBContainer>
    </MDBFooter>
  );
};

export default Footer;
