import React from "react";
import "./HomePage.scss";
import { observer } from "mobx-react-lite";
import { userStore } from "../../stores/UserStore";

export const HomePage: React.FC = observer(() => {
    const { user, test } = userStore;
    return (
        <div className="home-page">
            <h1>Home Page</h1>
            {user && "Hello " + user.name}
            <h1 onClick={test}>TEST</h1>
        </div>
    );
});