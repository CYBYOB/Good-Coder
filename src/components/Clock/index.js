// 时钟 组件

import React from 'react';


class Clock extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {clock} = this.props;

        return (
            <div className="clock-item">
                {
                    clock
                }
            </div>
        )
    }
}

export default Clock;