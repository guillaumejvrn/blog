"use client";
import Header from "@/app/component/Header";
import React, { useState } from "react";
import axiosInstance from "@/app/component/AxiosInstance";

export default function Register() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user = {
            name,
            email,
            password,
        };
        console.log(user);
        axiosInstance.post('/register', user).then(
            (response) => {
                console.log(response);
                window.location.href = '/blog/auth/login';
            }
        ).catch((error) => {
            console.log(error);
        })
    };

    return (
        <div>
            <Header />
            <div className="mainContent">
                <h2>Créer un compte</h2>
                <div className="register">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Entrer votre Nom d’utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nom d'utilisateur"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={true}
                        />

                        <label htmlFor="email">Entrer votre adresse mail</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required={true}
                        />

                        <label htmlFor="password">Entrer votre mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Choisissez votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={true}
                        />
                        <button type="submit">Valider</button>
                    </form>
                </div>
            </div>
        </div>
    );
}