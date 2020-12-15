import React, {Component} from 'react';
// import { Button } from 'antd';

import ClockList from './components/ClockList';

import './App.css';

class App extends Component {
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
