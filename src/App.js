import React from 'react';
// import { Button } from 'antd';

import ClockList from './components/ClockList';

import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    render() {
        return (
            <div className="app-container">
                <ClockList />
            </div>
        )
    }
}


export default App;
