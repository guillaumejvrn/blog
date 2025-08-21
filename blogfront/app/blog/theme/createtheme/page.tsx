"use client";
import Header from "@/app/component/Header";
import axiosInstance from "@/app/component/AxiosInstance";
import Cookies from "js-cookie";
import { useState } from "react";

export default function CreateTheme() {
    const [name, setName] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const theme = {
            "theme": name,
        };
        const cookie = Cookies.get('token');
        const header = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie
        }
        console.log(theme);
        axiosInstance.post('/createTheme', theme, { headers: header }).then(
            (response) => {
                console.log(response);
                window.location.href = '/';
            }
        ).catch((error) => {
            console.log(error);
        })
    }

    return (
        <div>
            <Header />
            <div className="mainContent">
                <div className="upHeaderTheme">
                    <p></p>
                    <h2>Créer un thème</h2>
                    <p></p>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Nom du thème</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="enter un thème"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button type="submit">Valider</button>
                </form>
            </div>
        </div>
    );
}