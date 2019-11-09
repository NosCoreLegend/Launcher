import React from 'react';
import Carousel from 'react-bootstrap/Carousel'
import './ads-carousel.css'

export class AdsCarousel extends React.Component {
  constructor(props: any, context: any) {
    super(props, context)

    this.handleSelect = this.handleSelect.bind(this)

    this.state = {
      index: 0,
      direction: null
    }
  }

  handleSelect(selectedIndex: any, e: { direction: any; }) {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    })
  }

  render() {
    return (
      <Carousel className='adsCarousel'>
        <Carousel.Item>
          <img
            className='d-block'
            src={require('./ads.jpg')}
            alt='First slide'
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className='d-block'
            src='https://en-images-nostale.gameforge.com//images/wallpapers/Feen3.jpg'
            alt='First slide'
          />
        </Carousel.Item>
      </Carousel>
    )
  }
}
