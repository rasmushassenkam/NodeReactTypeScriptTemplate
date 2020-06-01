import React from "react";
import "./NavBar.scss";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { userStore } from "../../stores/UserStore";

export const NavBar: React.FC = observer(() => {
	const { token, logoutUser } = userStore;
	return (
		<div className="nav-bar">
			<div className="links">
				<NavLink exact to="/">
					Home
        		</NavLink>
				<NavLink to={token ? "/account" : "/login"}>Account</NavLink>
				{token && <span style={{ color: "#F7F7FF", cursor: "pointer" }} onClick={logoutUser}>Logout</span>}
			</div>
		</div>
	);
});
