import React, {useState} from 'react';
import Modal from 'react-modal';

export default function Login(props) {

    const customStyles = {
        content: {
            top: '30%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
        closeButton: {
            marginTop: 1,
        }

    };

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }


    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [login, setLogin] = useState(null)

    async function loginUser(credentials) {
        await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                setLogin(data)
                props.onChange(data);
            })
    }

    const handleSubmit = async e => {
        e.preventDefault();
        await loginUser({
            username,
            password
        });
    }

    const ErrorMessage = () => {
        if (login === null) {
            return (
                <h6 style={{textAlign: "center", marginTop: 10}}>Please log in</h6>
            )
        } else if (login === false) {
            return (
                <h6 style={{textAlign: "center", marginTop: 10, color: "red"}}>Invalid username or password!</h6>
            )
        } else if (login === true) {
            return (
                <h6 style={{textAlign: "center", marginTop: 10, color: "green"}}>Login successful. You can now edit the
                    todo
                    list.</h6>
            )
        } else {
            return (<h1>Fucked</h1>)
        }
    }

    return (
        <div>
            <button onClick={openModal}>Log in</button>
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
                        <input type="text" onChange={e => setUserName(e.target.value)}/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password" onChange={e => setPassword(e.target.value)}/>
                    </label>
                    <button type="submit">Submit</button>
                </form>
                <div>
                    <ErrorMessage/>
                </div>

                <button style={{marginTop: 10}} onClick={closeModal}>Close</button>
            </Modal>
        </div>
    )
}

