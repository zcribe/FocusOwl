import React, {Component} from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    flex:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexColumn: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }

})

class BreakController extends Component {
    render() {
        return (
            <View style={styles.flexColumn}>
                <Text>Break</Text>
                <View style={styles.flex}>
                    <Button title="+"/>
                    <Text>10</Text>
                    <Button title="-"/>
                </View>
            </View>
        );
    }
}

export default BreakController;