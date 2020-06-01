import React, { useState, useEffect } from "react";
import "./LoginPage";
import { EInputFieldType } from "../../enums/EInputFieldType";
import { InputField } from "../../components/InputField/InputField";
import { userStore } from "../../stores/UserStore";
import {History} from "history";
import { observer } from "mobx-react-lite";

interface LoginPageProps {
    history: History;
    location: any;
}

export const LoginPage:React.FC<LoginPageProps> = observer(({history, location}) => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        // if(location.state && location.state.email && location.state.password) {
        //     setEmail(location.state.email);
        //     setPassword(location.state.password);
        // }
    },[location]);

    const handleAuthenticateUser = async () => {
        await userStore.authenticateUser(email, password);
        if(userStore.token) {
            history.push("/");
        }
    }

    return (
        <div className="login-page">
            <div className="error-text">{userStore.errorText}</div>
            <InputField value={email} label="email" width="250px" type={EInputFieldType.EMAIL} onChangeCallback={(e) => setEmail(e.target.value)}/>
            <InputField value={password} label="password" width="250px" type={EInputFieldType.PASSWORD} onChangeCallback={(e) => setPassword(e.target.value)}/>
            <div>Not a user yet?<span onClick={() => history.push("/register")}>Go to register page</span></div>
            <button onClick={handleAuthenticateUser}>Login</button>
        </div>
    );
});