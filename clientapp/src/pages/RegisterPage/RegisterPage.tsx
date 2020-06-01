import React, { useState } from "react";
import "./RegisterPage";
import { EInputFieldType } from "../../enums/EInputFieldType";
import { InputField } from "../../components/InputField/InputField";
import { userStore } from "../../stores/UserStore";
import {observer} from "mobx-react-lite";

import {History} from "history";

interface RegisterPageProps {
    history: History;
}

export const RegisterPage:React.FC<RegisterPageProps> = observer(({history}) => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
 
    const handleRegisterUser = async () => {
        await userStore.registerUser(name, email, password, password2);
        // if(userStore.user) {
        //     history.push("/login", {email, password});
        // }
    }

    return (
        <div className="login-page">
            <div className="error-text">{userStore.errorText}</div>
            <InputField value={name} label="name" width="250px" type={EInputFieldType.TEXT} onChangeCallback={(e) => setName(e.target.value)}/>
            <InputField value={email} label="email" width="250px" type={EInputFieldType.EMAIL} onChangeCallback={(e) => setEmail(e.target.value)}/>
            <InputField value={password} label="password" width="250px" type={EInputFieldType.PASSWORD} onChangeCallback={(e) => setPassword(e.target.value)}/>
            <InputField value={password2} label="repeat password" width="250px" type={EInputFieldType.PASSWORD} onChangeCallback={(e) => setPassword2(e.target.value)}/>
            <div>Already a user?<span onClick={() => history.push("/login")}>Go to Login page</span></div>
            <button onClick={handleRegisterUser}>Register</button>
        </div>
    );
});