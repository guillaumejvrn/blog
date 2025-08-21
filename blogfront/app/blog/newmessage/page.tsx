"use client";
import Header from "@/app/component/Header";
import { useState } from "react";
import Cookies from "js-cookie";
import axiosInstance from "@/app/component/AxiosInstance";

export default function Home() {
    const [message, setMessage] = useState<string>('');
    const [image, setImage] = useState<File | null>(null); // Stocke un fichier et non une string
    const [fileId, setFileId] = useState<string | null>(null); // Stocke l'ID du fichier

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]); // Stocke le fichier dans le state
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const token = Cookies.get("token");

        if (!token) {
            console.error("Aucun token trouvé !");
            return;
        }

        const headers = {
            "Authorization": `Bearer ${token}`
        };

        let uploadedFileId = fileId; // Conserve l'ID du fichier s'il existe déjà

        if (image) {
            // 📤 **Upload de l'image**
            const formData = new FormData();
            formData.append("file", image);

            try {
                const uploadResponse = await axiosInstance.post("/file/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        ...headers
                    }
                });
                console.log("Upload réussi :", uploadResponse.data);
                uploadedFileId = uploadResponse.data.id; // Récupère l'ID du fichier
                setFileId(uploadedFileId);
            } catch (error) {
                console.error("Erreur lors de l'upload :", error);
                return; // Arrête la soumission si l'upload échoue
            }
        }

        // 📤 **Envoi du message**
        const theme = Cookies.get("theme");
        const themeAsNumber = theme ? Number(theme) : null;

        const data = {
            messageContent: message,
            fileNum: uploadedFileId, // Utilise l'ID récupéré après l'upload
            themeID: themeAsNumber
        };

        try {
            const response = await axiosInstance.post("/sendMessage", data, {
                headers: { "Content-Type": "application/json", ...headers }
            });
            console.log("Message envoyé :", response.data);
            window.location.href = "/blog/theme/showtheme";
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    };

    return (
        <div>
            <Header />
            <div>
                <h2>Poster un nouveau message</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="message">Message</label>

                    {/* Input file corrigé */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <input
                        type="text"
                        id="message"
                        placeholder="Entrez votre message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                    <button type="submit">Poster</button>
                </form>
            </div>
        </div>
    );
}
