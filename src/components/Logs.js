import React, { useState } from "react";
import Modal from "react-modal";

export default function Logs() {
  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    table: {
      padding: 5,
    },
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    void getLogs();
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [logs, setLogs] = useState([]);

  const getLogs = async () => {
    await fetch(process.env.REACT_APP_API + "logs", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLogs(data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <button onClick={openModal}>View logs</button>
      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2>Logs:</h2>

        <table>
          <thead>
            <tr>
              <th> Date&Time</th>
              <th> Method</th>
              <th> UserID</th>
              <th> Task</th>
              <th> Completed</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((innerArray, index) => (
              <tr key={index}>
                {innerArray.map((item, index) => (
                  <td style={customStyles.table} key={index}>
                    {item}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}
