import React, { useEffect } from "react";
import "./App.scss";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { NavBar } from "./components/NavBar/NavBar";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { observer } from "mobx-react-lite";
import { userStore } from "./stores/UserStore";
import { Switch, Route } from "react-router-dom";

export const App = observer(() => {
	const { logoutUser, refreshToken } = userStore;

	useEffect(() => {
		const syncLogout = (event: StorageEvent) => {
			if (event.key === "logout") {
				console.log("logged out from storage");
				logoutUser()
			}
		}
		window.addEventListener("storage", syncLogout);
		return () => {
			window.removeEventListener("storage", syncLogout);
		}
	}, [logoutUser]);

	useEffect(() => {
		refreshToken();
	}, []);

	return (
		<div className="App">
			<NavBar />
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route path="/login" component={LoginPage} />
				<Route path="/register" component={RegisterPage} />
			</Switch>
		</div>
	);
});
