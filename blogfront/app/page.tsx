"use client";
import Header from "@/app/component/Header";
import { useEffect, useState } from "react";
import AxiosInstance from "@/app/component/AxiosInstance";
import Cookies from "js-cookie";
import ButtonCreateTheme from "@/app/component/ButtonCreateTheme";

export default function Home() {
    const [themes, setThemes] = useState<{ id: number, name: string }[]>([]);
    const [admin, setAdmin] = useState<boolean>(false);
    useEffect(() => {
        const cookie = Cookies.get('token');
        console.log(cookie);
        const header = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie
        }
        AxiosInstance.post('/userAdmin', {}, {headers:header}).then(
            (response) => {
                console.log(response);
                setAdmin(true);
            }
        ).catch((error) => {
            console.log(error);
            setAdmin(false);
        });

        Cookies.set('theme', '0');
        AxiosInstance.post('/getTheme').then(
            (response) => {
                console.log(response);
                const themeData = response.data.map((theme: { id: number, name: string }) => ({ id: theme.id, name: theme.name }));
                setThemes(themeData);
            }
        ).catch((error) => {
            console.log(error);
        });
    }, []);

    const themeRedirect = (themeId: number) => {
        Cookies.set('theme', themeId.toString());
        window.location.href = '/blog/theme/showtheme';
    }

    return (
        <div>
            <Header />
            <div className="mainContent">
                <div className="upHeaderTheme">
                    <p></p>
                    <h2>Rudolf Steiner</h2>
                    <div>
                        <ButtonCreateTheme admin={admin} />
                    </div>
                </div>
                <div className="underHeaderTheme">
                    <img className="imgSteiner" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Steiner_um_1905.jpg/640px-Steiner_um_1905.jpg" alt="Rudolf Steiner" />
                </div>
                <div className="themeContainer">
                    {themes.map((theme) => (
                        <div className="themebox" key={theme.id} onClick={() => themeRedirect(theme.id)}>
                            <div>{theme.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}