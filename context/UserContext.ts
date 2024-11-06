/* import { createContext, useContext, useState } from "react";

export const UserContext = createContext({
    nombre: "Ejemplo",
    id: 0,
    mail: "",
    isLoggedIn: false,
    cambiarNombre: (nombre: string) => { },
    login_app: () => { },
    logout: () => { },
});

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [nombre, setNombre] = useState("Ejemplo");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const cambiarNombre = (nombre: string) => {
        setNombre(nombre);
        try {
            const nuevo_user ={id:id,name:nombre,mail:mail}
            const rsp=await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/edit_profile`,
                {method: "PATCH",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(nuevo_user)
                }
            )
        } catch (e){
            console.log(e)
        }
    }

    const login_app = () => {
        setIsLoggedIn(true);
    }

    const logout = () => {
        setIsLoggedIn(false);
    }

    return (
        <UserContext.Provider value={{ nombre, id, cambiarNombre, isLoggedIn, login_app, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => {
    return useContext(UserContext);
} */