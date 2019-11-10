import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import styles from './ads-carousel.less';

export class AdsCarousel extends React.Component {
  constructor(props: any, context: any) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      index: 0,
      direction: null
    };
  }

  handleSelect(selectedIndex: any, e: { direction: any; }) {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  }

  render() {
    return (
      <Carousel className={styles.adsCarousel}>
        <Carousel.Item className={styles.carouselItem}>
          <img
            className='d-block'
            src={require('./ads.jpg')}
            alt='First slide'
          />
        </Carousel.Item>
        <Carousel.Item className={styles.carouselItem}>
          <img
            className='d-block'
            src='https://en-images-nostale.gameforge.com//images/wallpapers/Feen3.jpg'
            alt='First slide'
          />
        </Carousel.Item>
      </Carousel>
    );
  }
}
