import React, { Component } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
const firebase = require("firebase");
require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyBABnYV09Znle4CYWFr2GLkmZcxK4IUTHk",
  authDomain: "chat-app-d7ac1.firebaseapp.com",
  projectId: "chat-app-d7ac1",
  storageBucket: "chat-app-d7ac1.appspot.com",
  messagingSenderId: "50180339137",
  appId: "1:50180339137:web:dea881becd0fd7510eeb40",
  measurementId: "G-CFQKLB6HJC",
};

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
    };
    // initialises connection to Firebase DB
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // reference to all messages in DB
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    // adds user name to header
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // authenticates user with firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
        messages: [],
      });

      // listens for changes to DB
      this.unsubscribeChatUser = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  // unsubscribes from user authentication and DB updates
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribeChatUser();
  }

  // updates messages on client-side when new message added to DB
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // goes through each document
    querySnapshot.forEach((doc) => {
      // gets QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.nme,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages,
    });
  };

  // adds new message to DB
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
    });
  }

  // adds new message to messages array in state
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

  // custom styling for active user's message bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#008080",
          },
        }}
      />
    );
  }

  render() {
    const { bgColor } = this.props.route.params;

    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
        />
        {/* Android keyboard fix */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
