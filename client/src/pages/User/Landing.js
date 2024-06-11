import React, { Component } from 'react';
import NormalNavbar from '../../components/NormalNavbar';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import Footer from '../../components/Footer';

export default class Landing extends Component {
  render() {
    return (
      <div>
        <NormalNavbar />
        <Hero />
        <Features />
        <br></br>
        <br></br>
        <br></br>
        <Footer />
      </div>
    );
  }
}
