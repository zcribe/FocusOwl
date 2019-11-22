import React, {Component} from 'react';
import {ScrollView} from 'react-native';

class LicenceScreen extends Component {
    render() {
        return (
            <ScrollView>

            </ScrollView>
        );
    }
}

LicenceScreen.navigationOptions = {
    title: 'Licence',
    headerStyle: {
        backgroundColor: '#1A2640',
        color: '#E1E4F3'
    },
    headerTitleStyle: {
        color: '#E1E4F3'
    },
};

export default LicenceScreen;