import React from 'react';
// import { Button } from 'antd';

import ClockList from './components/ClockList';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clockList: [1, 2, 3]
        }
    }

    render() {
        return (
            <div className="app-container">
                <ClockList clockList={this.state.clockList} />
            </div>
        )
    }
}


export default App;
