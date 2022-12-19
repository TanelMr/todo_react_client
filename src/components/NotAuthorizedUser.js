import React from "react";

export const NotAuthorizedUser = ({title, completed}) => {
    return (
        <div>
            <div className={"container assignments"}>
                <div className={"row"}>
                    <div className={"col"} id={"Title"}>{title}</div>
                    <div className={"col"} id={"Completed"}>{completed}</div>
                    <div className={"col"}>
                        <button style={{color: "gray"}} id={"EditButton"}>Edit</button>
                        <button style={{color: "gray"}} id={"DeleteButton"}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
};
