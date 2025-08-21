"use client";
import {useEffect, useState} from "react";
import AxiosInstance from "@/app/component/AxiosInstance";
import Cookies from "js-cookie";
import Header from "@/app/component/Header";
import ButtonCreateMessage from "@/app/component/ButtonCreateMessage";

interface Message {
    timestamp: number[];
    userId: number;
    fileNum: number;
    id: number;
    content: string;
    author: {
        name: string;
    };
}

export default function Theme() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userNames, setUserNames] = useState<{ [key: number]: string }>({});
    const cookie = Cookies.get('token');
    const [image, setImage] = useState<{ [key: number]: string }>({});
    const theme = Cookies.get('theme');
    const [admin, setAdmin] = useState<boolean>(false);
    const [themeName, setThemeName] = useState<string>('');

    useEffect(() => {
        if (theme === undefined) {
            window.location.href = '/';
        }

        const header = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie
        }
        AxiosInstance.post('/userAdmin', {}, { headers: header }).then(
            (response) => {
                console.log(response);
                setAdmin(true);
            }
        ).catch((error) => {
            console.log(error);
            setAdmin(false);
        });

        if (theme) {
            const themeAsNumber = Number(theme);
            console.log("Cookie 'theme' trouvé:", themeAsNumber);
            const api = () => {
                return {
                    headers: {
                        'Authorization': `Bearer ${cookie}`
                    }
                }
            }
            AxiosInstance.get(`/getMessages?page=0&size=10&themeID=${themeAsNumber}`, api()).then(
                (response) => {
                    console.log(response);
                    setMessages(response.data.content);
                    const uniqueIds: number[] = Array.from(new Set(response.data.content.map((message: Message) => message.userId)));
                    const uniqueFileNums: number[] = Array.from(new Set(response.data.content.map((message: Message) => message.fileNum)));

                    uniqueFileNums.forEach((fileNum) => {
                        if (fileNum === null) return;
                        AxiosInstance.get(`/file/${fileNum}`, { responseType: "blob" }).then(
                            (response) => {
                                const url = URL.createObjectURL(response.data);
                                setImage(prevImage => ({
                                    ...prevImage,
                                    [fileNum]: url
                                }));
                            }
                        ).catch((error) => {
                            console.log(error);
                        });
                    });

                    uniqueIds.forEach((id) => {
                        const uniqueid = () => {
                            return {
                                userId: id
                            }
                        }
                        AxiosInstance.post(`/getUserById`, uniqueid()).then(
                            (response) => {
                                setUserNames(prevState => ({
                                    ...prevState,
                                    [id]: response.data.name
                                }));
                            }
                        ).catch((error) => {
                            console.log(error);
                        });
                    });

                }
            ).catch((error) => {
                console.log(error);
            });
        } else {
            console.log("Aucun cookie 'token' trouvé.");
        }

        const themeAsNumber = Number(theme);
        const themeId = {
            themeId: themeAsNumber
        };

        AxiosInstance.post('/getThemeById', themeId).then(
            (response) => {
                console.log(response);
                setThemeName(response.data.themeName);
            }
        ).catch((error) => {
            console.error("Error fetching theme by ID:", error);
        });

    }, [cookie]);

    const formatTimestamp = (timestamp: string | number | number[] | null): string => {
        // Si timestamp est un tableau, utiliser le premier élément
        if (Array.isArray(timestamp)) {
            timestamp = timestamp[0];  // Prendre le premier élément du tableau
        }

        // Si timestamp est un nombre, le convertir en chaîne
        if (typeof timestamp === "number") {
            timestamp = timestamp.toString();
        }

        // Vérification si le timestamp est valide
        if (!timestamp) {
            return "Pas de date";
        }

        const dateObj = new Date(timestamp);
        if (isNaN(dateObj.getTime())) {
            console.log("Invalid Date object created from:", timestamp);
            return "Pas de date";
        }

        const today = new Date();

        const isSameDay = dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear();

        const isSameYear = dateObj.getFullYear() === today.getFullYear();

        if (isSameDay) {
            return dateObj.toLocaleString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (isSameYear) {
            return dateObj.toLocaleString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
            });
        } else {
            return dateObj.toLocaleString("fr-FR", {
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                year: "numeric",
                month: "2-digit",
            });
        }
    };


    const deleteMessage= (messageId: number) => {
        const header = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie
        }
        const data = {
            "messageId": messageId
        }

        AxiosInstance.post('/deleteMessage', data, {headers:header}).then(
            (response) => {
                console.log(response);
                window.location.reload();
            }
        ).catch((error) => {
            console.log(error);
        });
    }

    console.log("theme name:", themeName);

    return (
        <div>
            <Header />
            <div className="mainContent">
                <div className="topFil">
                    <div></div>
                    <h2>{themeName}</h2>
                    <ButtonCreateMessage admin={admin} />
                </div>
                <div className="messages">
                    {messages.map((message: Message) => (
                        <div className="messagebox" key={message.id}>
                            <div className="topMessage">
                                <div className="messageUserName">{userNames[message.userId]}</div>
                                <div className="messageDate">{formatTimestamp(message.timestamp)}</div>
                            </div>
                            <div className="imgDiv">
                                {message.fileNum ? (
                                    <img src={image[message.fileNum]} className="imgPost" alt="Image uploadée" />
                                ) : (
                                    <div></div>
                                )}
                            </div>
                            <div className="messageContent">{message.content}</div>
                            <div className="deleteMessage">
                                {admin ? (
                                    <div className="bottomMessage">
                                        <div></div>
                                        <div className="deleteMessageDiv" onClick={() => deleteMessage(message.id)}>
                                            <svg className="iconTrashcan" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
                                        </div>
                                        </div>
                                    ) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

