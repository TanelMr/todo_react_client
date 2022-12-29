import React, { useState } from "react";
import Modal from "react-modal";

export default function Login(props) {
  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    closeButton: {
      marginTop: 1,
    },
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function afterOpenModal() {}

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(null);

  async function loginUser(credentials) {
    await fetch(process.env.REACT_APP_API + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data === false) {
          setLogin(data);
        } else {
          let userID = data.id;
          setLogin(userID);
          props.onChange(userID);
        }
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser({
      username,
      password,
    });
  };

  const Logout = () => {
    function logOut() {
      window.localStorage.removeItem("key");
      window.location.reload();
    }

    if (localStorage.getItem("key") === null) {
      return <button onClick={openModal}>Log in</button>;
    } else {
      return <button onClick={logOut}>Log out</button>;
    }
  };

  const ErrorMessage = () => {
    if (login === null) {
      return (
        <h4 style={{ textAlign: "center", marginTop: 10 }}>Please log in</h4>
      );
    } else if (login === false) {
      return (
        <h4 style={{ textAlign: "center", marginTop: 10, color: "red" }}>
          Invalid username or password!
        </h4>
      );
    } else {
      setTimeout(closeModal, 800);
      return (
        <h4 style={{ textAlign: "center", marginTop: 10, color: "green" }}>
          Login successful!
        </h4>
      );
    }
  };

  return (
    <div>
      <Logout />
      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h3>Log in</h3>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Username</p>
            <input type="text" onChange={(e) => setUserName(e.target.value)} />
          </label>
          <label>
            <p>Password</p>
            <input
              type="password"
              autoComplete="on"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
        <div>
          <ErrorMessage />
        </div>

        <button style={{ marginTop: 10 }} onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  );
}
