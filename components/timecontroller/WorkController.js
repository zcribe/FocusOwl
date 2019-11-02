import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexColumn: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

class WorkController extends Component {
    render() {
        return (
            <View style={styles.flexColumn}>
                <Text>Work</Text>
                <View style={styles.flex}>
                    <Button title="+"/>
                    <Text>10</Text>
                    <Button title="-"/>
                </View>
            </View>
        );
    }
}

export default WorkController;