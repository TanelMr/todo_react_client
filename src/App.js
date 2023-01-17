import React, { useEffect, useState } from "react";
import "./App.css";
import { AuthorizedUser } from "./components/AuthorizedUser";
import Login from "./components/Login";
import Logs from "./components/Logs";
import { NotAuthorizedUser } from "./components/NotAuthorizedUser";
import { connect } from "socket.io-client";

const { io } = require("socket.io-client");
const socket = io("ws://localhost:3001");

function App() {
  useEffect(() => {
    socket.on(connect, function () {
      console.log("Connected to websocket");
    });
    socket.onAny(() => {
      void fetchData();
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [toDo, setToDo] = useState([]);
  const [authorized, setAuthorized] = useState(false);

  const handleLogin = (value) => {
    localStorage.setItem("token", value.token);
    localStorage.setItem("userid", JSON.stringify(value.id));
    void fetchData();
  };

  const fetchData = async () => {
    if (
      localStorage.getItem("userid") === null &&
      localStorage.getItem("token") === null
    ) {
      await fetch(process.env.REACT_APP_API, {
        method: "GET",
      })
        .then((response) => {
          if (response.status !== 200) {
            setToDo(JSON.parse(localStorage.getItem("data")));
          } else return response.json();
        })
        .then((data) => {
          setToDo(data);
          localStorage.setItem("data", JSON.stringify(data));
        })
        .catch((error) => {
          console.log(error);
          setToDo(JSON.parse(localStorage.getItem("data")));
        });
    } else {
      await fetch(process.env.REACT_APP_API + "user", {
        method: "POST",
        body: JSON.stringify({
          id: localStorage.getItem("userid"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (response.status !== 200) {
            return toDo;
          } else return response.json();
        })
        .then((data) => {
          setToDo(data);
          localStorage.setItem("data", JSON.stringify(data));
          setAuthorized(true);
        })
        .catch((error) => {
          console.log(error);
          setToDo(JSON.parse(localStorage.getItem("data")));
        });
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const title = evt.target.task.value;
    const completed = evt.target.completed.value;

    await fetch(process.env.REACT_APP_API, {
      method: "POST",
      body: JSON.stringify({
        title: title,
        completed: completed,
        userID: JSON.parse(localStorage.getItem("userid")),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.status === 429) {
        window.alert("Too many requests. Please wait and try again later");
      } else {
        socket.emit("event");
      }
    });
    evt.target.task.value = "";
    evt.target.completed.value = "";
  };

  const onEdit = async (id, title, completed) => {
    await fetch(process.env.REACT_APP_API + id, {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        title: title,
        completed: completed,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.status === 429) {
          window.alert("Too many requests. Please wait and try again later");
        } else {
          socket.emit("event");
        }
      })
      .catch((error) => console.log(error));
  };

  const onDelete = async (id) => {
    await fetch(process.env.REACT_APP_API + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.status === 429) {
          window.alert("Too many requests. Please wait and try again later");
        } else {
          socket.emit("event");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="App">
      <div className={"loginAndLogButtons"}>
        <Login authorized={{}} onChange={handleLogin} /> <Logs />
      </div>

      <h1 className={"text-center"}>To Do List</h1>

      {authorized ? (
        <div className={"newToDoForm"}>
          <form onSubmit={handleOnSubmit}>
            <h5>Add new ToDo item</h5>
            <input
              placeholder="Task name"
              name="task"
              id={"AddingTaskTitleInput"}
            />
            <input
              placeholder="Is completed?"
              name="completed"
              id={"AddingTaskCompletedInput"}
            />
            <button onSubmit={handleOnSubmit} id={"AddButton"}>
              Add
            </button>
            <hr />
          </form>
        </div>
      ) : (
        <div />
      )}

      <div className={"container header"}>
        <div className={"row"}>
          <div className={"col"}>Assignment name</div>
          <div className={"col"}>Is completed?</div>
          <div className={"col"}>Edit assignment</div>
        </div>
      </div>

      {authorized ? (
        <div>
          {toDo.map((list) => (
            <AuthorizedUser
              key={list.id}
              id={list.id}
              title={list.title}
              completed={list.completed}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div>
          {toDo.map((list) => (
            <NotAuthorizedUser
              key={list.id}
              id={list.id}
              title={list.title}
              completed={list.completed}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          <h3 className={"loginAlert"}>
            Please log in to make changes to the list!
          </h3>
        </div>
      )}
    </div>
  );
}

export default App;
