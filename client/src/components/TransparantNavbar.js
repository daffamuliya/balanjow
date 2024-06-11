import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';

const TansparantNavbar = () => {
  return (
    <Navbar expand="lg" data-bs-theme="dark" style={{ backgroundColor: 'transparent', color: 'white', fontWeight: 'bold' }}>
      <Container>
        <Navbar.Brand href="#home">
          <img src="/img/white-logo.png" width="63" height="63" className="d-inline-block align-top" alt="React Bootstrap logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link href="#action2">Home</Nav.Link>
            <Nav.Link href="#action2">Forum</Nav.Link>
            <Nav.Link href="#action2">Blog</Nav.Link>
            <Nav.Link href="#action2">E Commerce</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <MDBBtn size="lg" className="me-2" style={{ backgroundColor: 'transparent', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'none', color: 'white' }}>
              Login
            </MDBBtn>
            <MDBBtn size="lg" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', fontWeight: 'bold', textAlign: 'center', border: 'black' }}>
              Sign In
            </MDBBtn>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TansparantNavbar;
