import React from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidView,
} from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    let name = this.props.route.params.name;
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hello ${name}, How are you doing today ?`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
          //image:
          // "https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_1280.jpg",
          // mark the message as sent using one tick
          sent: true,
          // mark message as recieved, using two tick
          received: true,
          // mark message as pending with a clock loader
          pending: true,
        },
        {
          _id: 2,
          text: `${name} has entered the chat `,
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "orange",
          },
        }}
        tickStyle={{ color: props.currentMessage.seen ? "#34B7F1" : "#999" }}
      />
    );
  }

  render() {
    // import name from Start
    let name = this.props.route.params.name;
    // import background color from Start
    let bgColor = this.props.route.params.bgColor;

    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.os === "android" ? (
          <KeyboardAvoidView behavior="height" />
        ) : null}
        {/* </View><Text style={styles.chatGreeting}>Hello {name}! Should we chat?</Text> */}
      </View>
    );
  }
}

//---------- Styles ----------//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
    // justifyContent: "center",
  },
});
