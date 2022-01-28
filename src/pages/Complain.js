// import useContext hook
import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";

import Navbar from "../components/Navbar";

import Contact from "../components/complain/Contact";

// import chat component
import Chat from "../components/complain/Chat";

// import user context
import { UserContext } from "../context/userContext";

// import socket.io-client
import { io } from "socket.io-client";

// initial variable outside socket
let socket;
export default function Complain() {
  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  // create messages state
  const [messages, setMessages] = useState([]);

  const title = "Complain admin";
  document.title = "DumbMerch | " + title;

  // consume user context
  const [state] = useContext(UserContext);

  useEffect(() => {
    socket = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        id: state.user.id,
      },
    });

    // define corresponding socket listener
    socket.on("new message", () => {
      console.log("contact", contact);
      console.log("triggered", contact?.id);
      socket.emit("load messages", contact?.id);
    });

    // listen error sent from server
    socket.on("connect_error", (err) => {
      console.error(err.message); // not authorized
    });
    loadContact();
    loadMessages();

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const loadContact = () => {
    // emit event load admin contact
    socket.emit("load admin contact");
    // listen event to get admin contact
    socket.on("admin contact", async (data) => {
      // manipulate data to add message property with the newest message
      const dataContact = {
        ...data,
        message:
          messages.length > 0
            ? messages[messages.length - 1].message
            : "Click here to start message",
      };
      setContacts([dataContact]);
    });
  };

  // used for active style when click contact
  const onClickContact = (data) => {
    setContact(data);
    // emit event load messages
    socket.emit("load messages", data.id);
  };

  const loadMessages = (value) => {
    // define listener on event "messages"
    socket.on("messages", async (data) => {
      // get data messages
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
        }));
        console.log(dataMessages);
        setMessages(dataMessages);
      }
      const chatMessagesElm = document.getElementById("chat-messages");
      chatMessagesElm.scrollTop = chatMessagesElm?.scrollHeight;
    });
  };
  const onSendMessage = (e) => {
    // listen only enter key event press
    if (e.key === "Enter") {
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      };

      //emit event send message
      socket.emit("send message", data);
      e.target.value = "";
    }
  };

  return (
    <>
      <Navbar title={title} />
      <Container fluid style={{ height: "89.5vh" }}>
        <Row>
          <Col
            md={3}
            style={{ height: "89.5vh" }}
            className="px-3 border-end border-dark overflow-auto"
          >
            <Contact
              dataContact={contacts}
              clickContact={onClickContact}
              contact={contact}
            />
          </Col>
          <Col md={9} style={{ maxHeight: "89.5vh" }} className="px-0">
            <Chat
              contact={contact}
              messages={messages}
              user={state.user}
              sendMessage={onSendMessage}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
