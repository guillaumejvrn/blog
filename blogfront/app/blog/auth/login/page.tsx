'use client';
import Header from "@/app/component/Header";
import React from "react";
import axiosInstance from "@/app/component/AxiosInstance";
import Cookies from "js-cookie";

export default function Login() {
    const [email, GetEmail] = React.useState('');
    const [password, GetPassword] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // console.log(email, password);
        const user = {
            email,
            password,
        };
        axiosInstance.post('/login', user).then(
            (response) => {
                console.log(response);
                Cookies.set('token', response.data.token, {expires: 7, secure: true});
                window.location.href = '/blog/auth/profil';
            }
        ).catch((error) => {
            console.log(error);
        })
    };

    return (
        <div>
            <Header />
            <div className="mainContent">
                <h2>Authentication</h2>
                <div className="register">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Adresse mail</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => GetEmail(e.target.value)}
                            required={true}
                        />

                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => GetPassword(e.target.value)}
                            required={true}
                        />
                        <a href={'/blog/auth/register'} className="pasencoreinscrit">Pas encore inscrit ?</a>
                        <button type="submit">Valider</button>
                    </form>
                </div>
            </div>
        </div>
    )
}