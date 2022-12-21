import React, {useState} from 'react';
import Modal from 'react-modal';

async function loginUser(credentials) {
    await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        // .then((response) => {
        //     console.log(response)
        //     return response.json()
        // })
        .then((data) => {
            console.log(data)
            return data.json()
        })
}

export default function Login() {

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
            username,
            password
        });
        console.log(response)
        // if (response === []) {
        //     console.log("User authenticated")
        // } else {
        //     console.log("User not authenticated")
        // }
        // setAuthorized(token);
    }

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

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
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
                contentLabel="Login modal"
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
                <button style={{marginTop: 10}} onClick={closeModal}>Close</button>
            </Modal>
        </div>
    )
}

