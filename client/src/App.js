import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  Login,
  Register,
  Landing,
  Home,
  Forum,
  Blog,
  UploadBlog,
  DetailBlog,
  ECommerce,
  KategoriEcom,
  DetailProduk,
  Cart,
  Checkout,
  DetailOrder,
  BuktiBayar,
  Dashboard,
  KelolaBlog,
  KelolaEcommerce,
  KelolaForum,
  KelolaUser,
  RequestedBanner,
  AkunDetails,
  KelolaBlogUser,
  KelolaForumUser,
  RiwayatPesanan,
  DashboardSeller,
  PesananSeller,
  ProductSeller,
  UploadProduk,
  TambahBanner,
  DaftarBannerUser,
  TambahBannerUser,
} from './pages';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/upload-blog" element={<UploadBlog />} />
            <Route path="/detail-blog/:slug" element={<DetailBlog />} />
            <Route path="/ecommerce" element={<ECommerce />} />
            <Route path="/kategori-ecom/:id" element={<KategoriEcom />} />
            <Route path="/detail-produk/:id" element={<DetailProduk />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/detail-order" element={<DetailOrder />} />
            <Route path="/bukti-bayar" element={<BuktiBayar />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/blog" element={<KelolaBlog />} />
            <Route path="/admin/ecommerce" element={<KelolaEcommerce />} />
            <Route path="/admin/forum" element={<KelolaForum />} />
            <Route path="/admin/user" element={<KelolaUser />} />
            <Route path="/admin/banner" element={<RequestedBanner />} />
            <Route path="/admin/upload-banner" element={<TambahBanner />} />
            <Route path="/user/akun" element={<AkunDetails />} />
            <Route path="/user/blog" element={<KelolaBlogUser />} />
            <Route path="/user/forum" element={<KelolaForumUser />} />
            <Route path="/user/pesanan" element={<RiwayatPesanan />} />
            <Route path="/seller" element={<DashboardSeller />} />
            <Route path="/seller/pesanan" element={<PesananSeller />} />
            <Route path="/seller/product" element={<ProductSeller />} />
            <Route path="/seller/upload-produk" element={<UploadProduk />} />
            <Route path="/seller/daftar-banner" element={<DaftarBannerUser />} />
            <Route path="/seller/upload-banner" element={<TambahBannerUser />} />
          </Routes>
        </main>
      </BrowserRouter>
    );
  }
}
