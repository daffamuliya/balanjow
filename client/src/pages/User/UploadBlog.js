import React, { useState, useEffect } from 'react';
import NormalNavbar from '../../components/NormalNavbar';
import Footer from '../../components/Footer';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';

const UploadBlog = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const user_id = user ? user.id : null;

  const [judul, setJudul] = useState('');
  const [slug, setSlug] = useState('');
  const [kategori_blog, setKategori] = useState('Pilih Kategori');
  const [file, setFile] = useState('');
  const [summary, setSummary] = useState('');
  const [konten, setKonten] = useState('');

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const slugified = slugify(judul);
    setSlug(slugified);
  }, [judul]);

  const saveBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('user', user.name);
    formData.append('judul', judul);
    formData.append('slug', slug);
    formData.append('kategori_blog', kategori_blog);
    formData.append('file', file);
    formData.append('summary', summary);
    formData.append('konten', konten);
    try {
      await axios.post('http://${url}/blog/addBlog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      swal({
        icon: 'success',
        title: 'Success',
        text: 'Blog berhasil di upload!',
      }).then(() => {
        navigate('/blog');
      });
    } catch (error) {
      swal({
        icon: 'error', // Mengubah ikon menjadi 'error' karena ini adalah blok catch
        title: 'Error',
        text: error.response ? error.response.data.message : 'Something went wrong', // Menampilkan pesan kesalahan yang lebih informatif
      });
      console.log(error);
    }
  };

  // Fungsi untuk mengubah teks menjadi slug
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Ganti spasi dengan tanda hubung
      .replace(/[^\w\-]+/g, '') // Hapus karakter non-word kecuali tanda hubung
      .replace(/\-\-+/g, '-') // Ganti beberapa tanda hubung berurutan dengan satu tanda hubung
      .replace(/^-+/, '') // Hapus tanda hubung dari awal teks
      .replace(/-+$/, ''); // Hapus tanda hubung dari akhir teks
  };

  return (
    <div>
      <NormalNavbar />
      <MDBContainer>
        <MDBRow className="mt-3 justify-content-center">
          <MDBCol md={12} xs={2} className="ms-auto">
            <img src="/img/upload-blog.png" className="hover-shadow" alt="" style={{ width: '100%' }} />
          </MDBCol>
        </MDBRow>
        <section className="blog">
          <div className="row">
            <div className="col-12 mb-4 mt-4">
              <form onSubmit={saveBlog}>
                <div className="mb-3">
                  <label htmlFor="judul" className="form-label">
                    Judul
                  </label>
                  <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} className="form-control" id="judul" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="slug" className="form-label">
                    Slug
                  </label>
                  <input type="text" value={slug} readOnly className="form-control" id="slug" disabled />
                </div>
                <div className="mb-3">
                  <label htmlFor="kategori_blog" className="form-label">
                    Kategori
                  </label>
                  <select value={kategori_blog} onChange={(e) => setKategori(e.target.value)} className="form-select" aria-label="Default select example" id="kategori_blog">
                    <option value="Pilih Kategori">Pilih Kategori</option>
                    <option value="Wirausaha">Wirausaha</option>
                    <option value="Keuangan Finansial">Keuangan Finansial</option>
                    <option value="Bisnis Teknologi">Bisnis Teknologi</option>
                    <option value="Agribisnis">Agribisnis</option>
                    <option value="Bisnis Peternakan">Bisnis Peternakan</option>
                    <option value="Bisnis Kuliner">Bisnis Kuliner</option>
                    <option value="Bisnis Kreatif">Bisnis Kreatif</option>
                    <option value="Bisnis Jasa">Bisnis Jasa</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="file">
                    Foto
                  </label>
                  <input type="file" onChange={loadImage} className="form-control" id="file" />
                </div>
                <div className="mb-3">
                  <label htmlFor="summary" className="form-label">
                    Ringkasan
                  </label>
                  <textarea className="form-control" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Ringkasan yang merangkum konten anda" id="summary"></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="konten" className="form-label">
                    Body
                  </label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={konten}
                    onReady={(editor) => {
                      console.log('Editor is ready to use!', editor);
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setKonten(data);
                    }}
                    onBlur={(event, editor) => {
                      console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                      console.log('Focus.', editor);
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', float: 'right' }}>
                  Kirim
                </button>
              </form>
            </div>
          </div>
        </section>
      </MDBContainer>
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default UploadBlog;
