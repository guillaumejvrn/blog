"use client";
import Header from "@/app/component/Header";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/app/component/AxiosInstance";

export default function Profil() {
    const [name, setName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [role, setRole] = React.useState<string>("");
    const cookie = Cookies.get('token');

    useEffect(() => {
        if (cookie === undefined) {
            window.location.href = '/blog/auth/login';
        }
        const api = () => {
            return Cookies.get('token') ? { headers: { Authorization: `Bearer ${Cookies.get('token')}` } } : {};
        }
        axiosInstance.get('/user', api()).then(
            (response) => {
                console.log(response);
                setName(response.data.name);
                setEmail(response.data.email);
                setRole(response.data.role);
            }
        ).catch((error) => {
            console.log(error);
        });
    }, []);

    const logout = () => {
        Cookies.remove('token');
        window.location.href = '/blog/auth/login';
    }

    return (
        <div>
            <Header />
            <div className="mainContent">
                <h2>Profil</h2>
                <div className="profilPage">
                    <div className="profilName">{name}</div>
                    <h3>Mes informations</h3>
                    <div className="profilEmail">Mail : {email}</div>
                    <div className="profilRole">Role : {role}</div>
                    <div className="buttoncenter">
                        <button onClick={logout}>Se déconnecter</button>
                    </div>
                </div>
            </div>
        </div>
    );
}