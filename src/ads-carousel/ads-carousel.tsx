import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import styles from './ads-carousel.less';
import Store from 'electron-store';

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

  renderAds = () => {
    const store = new Store();
    const ads = store.get('configuration').Ads;
    return Object.keys(ads).map((index: string) =>
    <Carousel.Item key={index} className={styles.carouselItem}>
     <img
        className='d-block'
        src={ads[index].URL}
        alt={ads[index].Description}
      />
    </Carousel.Item>);
  }

  render() {
    return (
      <Carousel pauseOnHover={true} interval={5000} className={styles.adsCarousel}>
        <Carousel.Item className={styles.carouselItem}>
          <img
            className='d-block'
            src={require('./NosCoreLegend.png')}
            alt='First slide'
            width="100%"
          />
        </Carousel.Item>
        {this.renderAds()}
      </Carousel>
    );
  }
}
