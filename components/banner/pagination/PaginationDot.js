import React, { Component, PropTypes } from 'react';

const styles = {
    root: {
        height: '.5rem',
        width: '.5rem',
        cursor: 'pointer',
        border: 0,
        background: 'none',
        padding: 0,
        textAlign: 'center',
    },
    dot: {
        backgroundColor: '#e4e6e7',
        height: '.3rem',
        width: '.3rem',
        borderRadius: '50%',
        margin: '.1rem',
    },
    active: {
        backgroundColor: '#319fd6',
    },
};

export default class PaginationDot extends Component {
    static propTypes = {
        active: PropTypes.bool.isRequired,
        index: PropTypes.number.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    handleClick = event => {
        this.props.onClick(event, this.props.index);
    };

    render() {
        const { active } = this.props;

        let styleDot;

        if (active) {
            styleDot = Object.assign({}, styles.dot, styles.active);
        } else {
            styleDot = styles.dot;
        }

        return (
            <button style={styles.root} onClick={this.handleClick}>
                <div style={styleDot} />
            </button>
        );
    }
}