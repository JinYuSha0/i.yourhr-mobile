import React, { Component, PropTypes } from 'react';

import PaginationDot from './PaginationDot';

const styles = {
    main: {
        width: '100%',
        position: 'absolute',
        bottom: 8,
        textAlign: 'center'
    }
};

export default class Pagination extends Component {
    static propTypes = {
        dots: PropTypes.number.isRequired,
        index: PropTypes.number.isRequired,
        onChangeIndex: PropTypes.func.isRequired,
    };

    handleClick = (event, index) => {
        this.props.onChangeIndex(index);
    };

    render() {
        const { index, dots } = this.props;

        const children = [];

        for (let i = 0; i < dots; i += 1) {
            children.push(
                <PaginationDot key={i} index={i} active={i === index} onClick={this.handleClick} />
            );
        }

        return (
            <div style={styles.main}>
                {children}
            </div>
        );
    }
}