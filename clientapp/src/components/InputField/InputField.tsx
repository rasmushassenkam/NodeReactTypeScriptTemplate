import React from "react";
import "./InputField.scss";
import { EInputFieldType } from "../../enums/EInputFieldType";

interface InputFieldProps {
    label?: string;
    type: EInputFieldType;
    width: string;
    error?: string;
    value: string;
    onChangeCallback: (e:React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField:React.FC<InputFieldProps> = ({label, type, width, error, value, onChangeCallback}) => {
    return(
        <div className="input-field" style={{width: width}}>
            <span className="input-label">{label}</span>
            <input className={(error ? " error" : "")} type={type} value={value} onChange={(e) => onChangeCallback(e)}/>
            <span className="error-text">{error}</span>
        </div>
    )
}