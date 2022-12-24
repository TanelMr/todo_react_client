import React, {useEffect, useState} from "react";
import './App.css';
import {AuthorizedUser} from "./components/AuthorizedUser";
import Login from "./components/Login"
import Logs from "./components/Logs"
import {connect} from "socket.io-client";
import {NotAuthorizedUser} from "./components/NotAuthorizedUser";

const {io} = require("socket.io-client");

const socket = io("ws://localhost:3001");

function App() {

    useEffect(() => {
        socket.on(connect, function () {
            console.log('Connected to websocket')
        })
        socket.onAny(() => {
            void fetchData()
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [toDo, setToDo] = useState([]);


    const fetchData = async () => {
        await fetch(process.env.REACT_APP_API, {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        })
            .then((response) => {
                if (response.status !== 200) {
                    return toDo
                } else
                    return response.json();
            })
            .then((data) => {
                setToDo(data)
                localStorage.setItem('data', JSON.stringify(data))
            })
            .catch((error) => {
                console.log(error)
                setToDo(JSON.parse(localStorage.getItem('data')))
            });
    };

    useEffect(() => {
        void fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnSubmit = async (evt) => {

        evt.preventDefault();
        const title = evt.target.task.value
        const completed = evt.target.completed.value

        await fetch(process.env.REACT_APP_API, {

            method: "POST",
            body: JSON.stringify({
                title: title,
                completed: completed,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                    const getLastId = toDo[toDo.length - 1]
                    const setLastId = getLastId.id
                    data.id = setLastId + 1
                    setToDo((toDo) => [...toDo, data]);
                    socket.emit('event')
                    localStorage.setItem('data', JSON.stringify(toDo))

                }
            )
        evt.target.task.value = ""
        evt.target.completed.value = ""

    };

    const onEdit = async (id, title, completed) => {

        await fetch(process.env.REACT_APP_API + id, {
            method: "PUT",
            body: JSON.stringify({
                id: id,
                title: title,
                completed: completed
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                socket.emit('event')
                const updatedUsers = toDo.map((list) => {
                    if (list.id === id) {
                        list.title = title;
                        list.completed = completed;
                    }
                    return list;
                });

                setToDo((toDo) => updatedUsers);
            })
            .catch((error) => console.log(error));
        localStorage.setItem('data', JSON.stringify(toDo))
    };

    const onDelete = async (id) => {

        await fetch(process.env.REACT_APP_API + id, {
            method: "DELETE"
        })
            .then((response) => {
                socket.emit('event')
                setToDo(
                    toDo.filter((ToDo) => {
                        return ToDo.id !== id;
                    })
                );
            })
            .catch((error) => console.log(error));
        localStorage.setItem('data', JSON.stringify(toDo))

    };

    const [authorized, setAuthorized] = useState(false)
    const handleLogin = (value) => {
        setAuthorized(value);
    }

    console.log(authorized)


    return (
        <div className="App">

            <div className={"loginAndLogButtons"}>
                <Login authorized={null} onChange={handleLogin}/> <Logs/>
            </div>

            <h1 className={"text-center"}>To Do List</h1>

            {authorized ? (
                <div className={"newToDoForm"}>
                    <form onSubmit={handleOnSubmit}>
                        <h5>Add new ToDo item</h5>
                        <input placeholder="Task name" name="task" id={"AddingTaskTitleInput"}/>
                        <input placeholder="Is completed?" name="completed" id={"AddingTaskCompletedInput"}/>
                        <button onSubmit={handleOnSubmit} id={"AddButton"}>Add</button>
                        <hr/>
                    </form>
                </div>
            ) : (
                <div/>
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
                        <AuthorizedUser key={list.id}
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
                        <NotAuthorizedUser key={list.id}
                                           id={list.id}
                                           title={list.title}
                                           completed={list.completed}
                                           onEdit={onEdit}
                                           onDelete={onDelete}
                        />
                    ))}
                    <h3 className={"loginAlert"}>Please log in to make changes to the list!</h3>
                </div>
            )}

        </div>
    );
}

export default App;
