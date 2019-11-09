import React, { Fragment } from 'react';
import { GiCalendar } from 'react-icons/gi';
import { FaStar, FaUsers, FaLightbulb } from 'react-icons/fa';
import './news-panel.css';
import { AdsCarousel } from '../ads-carousel/ads-carousel';

export class NewsPanel extends React.Component {
    render() {
        return (
            <Fragment>
                <div className='statusPanel'>
                    <h5><FaStar /> Status</h5>
                    <ul>
                        <li><FaLightbulb /> Server Online</li>
                        <li><FaUsers /> 299 players</li>
                    </ul>
                </div>
                <div className='newsPanel'>
                    <h5><GiCalendar />News & Events</h5>
                    <ul>
                        <li>22.06.2019 Double Jackpot Event</li>
                        <li>21.06.2019 Event: Triple Fortune</li>
                        <li>21.06.2019 NosVille in Football Fever!</li>
                        <li>18.06.2019 Maintenance</li>
                        <li>15.06.2019 24hr Happy Hour - let it rain NosDollars!</li>
                    </ul>
                </div>
                <AdsCarousel />
            </Fragment>
        );
    }
}
