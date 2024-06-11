import React, { Component } from 'react';
import NormalNavbar from '../../components/NormalNavbar';
import Footer from '../../components/Footer';
import Form from 'react-bootstrap/Form';
import { MDBContainer, MDBRow, MDBCol, MDBCardBody, MDBCard } from 'mdb-react-ui-kit';
export default class Landing extends Component {
  render() {
    return (
      <div>
        <NormalNavbar />
        <MDBContainer>
          <MDBRow className="mt-3 justify-content-center">
            <MDBCol size="12">
              <h2 className="text-center mb-3 mt-3" style={{ fontWeight: 'bold', color: '#A08336' }}>
                Checkout
              </h2>
              <MDBCard>
                <MDBCardBody>
                  {' '}
                  <div class="row">
                    <div class="col-12 mb-4 mt-4">
                      <form>
                        <h3 className="text-center mb-3 mt-4" style={{ fontWeight: 'bold' }}>
                          Address Information
                        </h3>
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label" style={{ fontWeight: 'bold' }}>
                            Alamat Lengkap
                          </label>
                          <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="alamat lengkap anda" />
                        </div>
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label" style={{ fontWeight: 'bold' }}>
                            Provinsi
                          </label>
                          <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="provinsi" />
                        </div>
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label" style={{ fontWeight: 'bold' }}>
                            Kota
                          </label>
                          <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="kota" />
                        </div>
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label" style={{ fontWeight: 'bold' }}>
                            Kode Pos
                          </label>
                          <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="kode pos" />
                        </div>
                      </form>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
              <MDBCard className="mt-3">
                <MDBCardBody>
                  <h3 className="text-center mb-3" style={{ fontWeight: 'bold' }}>
                    Opsi Pengiriman
                  </h3>
                  <Form>
                    {['radio'].map((type) => (
                      <div key={`reverse-${type}`} className="mb-3">
                        <Form.Check label="COD" name="group1" type={type} id={`${type}-1`} />
                        <Form.Check label="J&T" name="group1" type={type} id={`${type}-2`} />
                      </div>
                    ))}
                  </Form>
                </MDBCardBody>
              </MDBCard>
              <MDBCol size="12" className="mt-3 text-end">
                <a href="detail-order" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', display: 'inline-block' }}>
                  Bayar
                </a>
              </MDBCol>
            </MDBCol>
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
