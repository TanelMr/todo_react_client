import React, { useState } from "react";
import Modal from "react-modal";

export default function CreateUser(props) {
  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [username, setNewUserName] = useState("");
  const [password, setNewPassword] = useState("");
  const [login, setLogin] = useState(null);

  async function createUser(credentials) {
    console.log(credentials);
    if (credentials.username === "" || credentials.password === "") {
      window.alert("Username and password can't be empty!");
      return;
    }
    await fetch(process.env.REACT_APP_API + "users/new-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }).then((response) => {
      if (response.status === 409) {
        window.alert("User with that name already exists!");
        setLogin(null);
      } else {
        window.alert(
          "New user created successfully! Use your new username and password to log in."
        );
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({
      username,
      password,
    });
  };

  return (
    <div>
      <button onClick={openModal}>Create new user</button>
      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h3>Create new user</h3>
        <form onSubmit={handleSubmit}>
          <label>
            <p>Insert username</p>
            <input
              type="text"
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </label>
          <label>
            <p>Insert password</p>
            <input
              type="password"
              autoComplete="on"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <button type="submit">Create!</button>
        </form>
        <button style={{ marginTop: 30 }} onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  );
}
