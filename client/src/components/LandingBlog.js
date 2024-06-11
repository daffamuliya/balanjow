import { MDBContainer, MDBRow, MDBBtn, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LandingBlog = () => {
  const [blog, setBlog] = useState([]);
  const url = process.env.url;

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = async () => {
    try {
      const response = await axios.get(`${url}/blog`);
      const formattedBlogs = response.data.items.map((item) => {
        const waktu = new Date(item.created_at);
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Jakarta',
        };
        const waktuNormal = waktu.toLocaleDateString('id-ID', options);
        return { ...item, waktuNormal };
      });
      setBlog(formattedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  return (
    <section className="landingeforum">
      <MDBContainer>
        <MDBRow className="pt-5">
          {Array.isArray(blog) &&
            blog.map((item) => (
              <MDBCol key={item.id} md={4} xs={12} className="mt-3">
                <a href={`detail-blog/${item.slug}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <MDBCard style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '28px', border: 'none', maxWidth: '352px', Height: '444px' }} className="text-left">
                    <MDBCardImage src={item.url} position="top" alt="..." />
                    <MDBCardBody>
                      <MDBBtn className="mb-3" color="light" style={{ color: '#A08336', fontSize: '14px' }}>
                        {item.kategori_blog}
                      </MDBBtn>
                      <MDBCardTitle style={{ fontSize: '20px', fontWeight: 'bold' }}>{item.judul}</MDBCardTitle>{' '}
                      <div className="d-flex">
                        <MDBCardImage className="me-2 mt-2" src="/img/profile.png" style={{ width: '13%', height: '13%' }} />
                        <MDBCardText className="mt-3" style={{ color: '#97989F', fontSize: '14px' }}>
                          Article by {item.user}
                        </MDBCardText>
                        <MDBCardText className="ms-5 mt-3 " style={{ color: '#97989F', fontSize: '14px' }}>
                          {item.waktuNormal}
                        </MDBCardText>
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </a>
              </MDBCol>
            ))}
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default LandingBlog;
