import React, { useState } from "react";

export const User = ({id, title, completed, onEdit, onDelete}) => {
    const [isEdit, setIsEdit] = useState(false);

    const handleEdit = () => {
        setIsEdit(!isEdit);
    };

    const handleOnEditSubmit = (evt) => {
        evt.preventDefault();
        onEdit(id, evt.target.task.value, evt.target.completed.value);
        setIsEdit(!isEdit);
    };

    const handleDelete = () => {
        onDelete(id);
    };

    return (
        <div>
        {isEdit ? (
                    <form onSubmit={handleOnEditSubmit}>
                        <input placeholder="Task" name="task" defaultValue={title} id={"EditTaskTitleInput"} />
                        <input placeholder="Completed" name="completed" defaultValue={completed} id={"EditTaskCompletedInput"} />
                        <button onSubmit={handleOnEditSubmit} id={"SaveEditButton"}>Save</button>
                        <button onSubmit={handleEdit}>Cancel</button>
                    </form>
                ) : (
                    <div className={"container assignments"}>
                        <div className={"row"}>
                        <div className={"col"} id={"Title"}>{title}</div>
                        <div className={"col"} id={"Completed"}>{completed.toString()}</div>
                        <div className={"col"}>
                            <button onClick={handleEdit} id={"EditButton"}>Edit</button>
                            <button onClick={handleDelete} id={"DeleteButton"}>Delete</button>
                        </div>
                        </div>
                    </div>
    )}
        </div>
    )
};
