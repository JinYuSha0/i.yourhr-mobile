import './address.less'

import React, { Component } from 'react'

export default class Address extends Component {
    componentDidMount() {
        const map = new BMap.Map(this.map),
            latlong = this.props.latLong.split(','),
            point = new BMap.Point(latlong[0], latlong[1]),
            marker = new BMap.Marker(point)

        map.addOverlay(marker)
        map.centerAndZoom(point, 20)
        map.enableScrollWheelZoom(true)
        map.enableContinuousZoom(true)
    }

    render() {
        const { localName, telephone } = this.props
        return (
            <div className="address">
                <div className="map" ref={map => this.map = map}></div>
                <div className="info">
                    <p className="localName">{localName}</p>
                    <p className="telephone">
                        联系电话:
                        <a href={"tel:" + telephone}>{telephone}</a>
                    </p>
                </div>
            </div>
        )
    }
}