import React, {Component} from 'react';
import {Text, View} from 'react-native';
import ProgressCircle from 'react-native-progress-circle'


class Timer extends Component {




    render() {
        return (
            <View>
                <ProgressCircle
                    percent={this.props.donePercent}
                    radius={100}
                    borderWidth={15}
                    color="#3399FF"
                    shadowColor="#999"
                    bgColor="#fff"
                >
                    <Text style={{fontSize: 24}}>{this.props.timeLeft}</Text>
                </ProgressCircle>
            </View>
        );
    }
}

export default Timer;