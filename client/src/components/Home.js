import React from 'react';
import '../styles/Home.scss';
import backgroundImage from '../assets/images/background-image.jpg';

const Home = () => {
  return (
    <div className='home-container'>
      <img
        src={backgroundImage}
        className='center-fit'
        alt='background-image'
      />
      {/* <h1>Welcome to the House of Books!</h1>
            <h2>
                We believe that books are necessary for a healthy culture. Our
                website is a one-stop-destination for all the reading
                enthusiasts, booksellers and authors.
            </h2> */}
    </div>
  );
};

export default Home;
