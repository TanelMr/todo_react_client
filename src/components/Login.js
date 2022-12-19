import React from 'react';
import Modal from 'react-modal';

export default function Login() {

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

    let subtitle;
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
                <form>
                    <label>
                        <p>Username</p>
                        <input type="text"/>
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="password"/>
                    </label>
                    <button type="submit">Submit</button>
                </form>
                <button style={{marginTop: 10}} onClick={closeModal}>Close</button>
            </Modal>
        </div>
    )
}
