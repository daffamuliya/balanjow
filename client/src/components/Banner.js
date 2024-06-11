import axios from 'axios';
import { MDBCol, MDBContainer, MDBRow } from 'mdb-react-ui-kit';
import { useState, useEffect } from 'react';

const Banner = () => {
  const [banner, setBanner] = useState();
  const url = process.env.url;

  useEffect(() => {
    getBanner();
  }, []);

  const getBanner = async () => {
    const response = await axios.get(`${url}/marketplace/banner/activeBanner`);
    setBanner(response.data.items);
  };

  return (
    <section className="banner mt-5">
      <MDBContainer>
        <MDBRow>
          <MDBCol size="12">
            <img src="/img/banner.png" className="img-fluid hover-shadow" alt="" />
          </MDBCol>
        </MDBRow>
        <MDBRow className="mt-3 justify-content-around">
          {Array.isArray(banner) &&
            banner.map((item, index) => (
              <MDBCol size="6">
                <img src={item.gambar} className="img-fluid hover-shadow" alt="" />
              </MDBCol>
            ))}
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default Banner;
