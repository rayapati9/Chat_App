import React from "react";
import { View, Text, Button } from "react-native";

export default class Screen1 extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Hello Screen1!</Text>
        <Button
          title="go to Screen 2"
          onPress={() => this.props.navigation.navigate("Screen 2")}
        />
      </View>
    );
  }
}
