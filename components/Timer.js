import React, {Component} from 'react';
import {View, Text} from 'react-native';
import ProgressCircle from 'react-native-progress-circle'


class Timer extends Component {
    render() {
        return (
            <View>
                <ProgressCircle
            percent={30}
            radius={50}
            borderWidth={8}
            color="#3399FF"
            shadowColor="#999"
            bgColor="#fff"
        >
            <Text style={{ fontSize: 12 }}>{'20min 50s'}</Text>
        </ProgressCircle>
            </View>
        );
    }
}

export default Timer;