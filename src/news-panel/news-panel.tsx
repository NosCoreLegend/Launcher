import React, { Fragment } from 'react';
import { GiCalendar } from 'react-icons/gi';
import { FaStar, FaUsers, FaLightbulb } from 'react-icons/fa';
import status from './news-panel.less';
import { AdsCarousel } from '../ads-carousel/ads-carousel';
import Store from 'electron-store';

export class NewsPanel extends React.Component {
    render() {
        const store = new Store();
        return (
            <Fragment>
                <div className={status.statusPanel}>
                    <h5><FaStar /> Status</h5>
                    <ul>
                        <li><FaLightbulb /> Server Online</li>
                        <li><FaUsers /> 299 players</li>
                    </ul>
                </div>
                <div className={status.newsPanel}>
                    <h5><GiCalendar />News & Events</h5>
                    <ul>{Object.keys(store.get('configuration').News).map((index: string) => <li key={index}><a href={store.get('configuration').News[index]}>{index}</a></li>)}</ul>
                </div>
                <AdsCarousel />
            </Fragment>
        );
    }
}
