import { createContext, useContext, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "@/components/tipos";

export const UserContext = createContext({
  nombre: "Ej",
  id: 1,
  mail: "mail",
  isLoggedIn: false,
  saldo: 1,
  cambiarNombre: (nombre_nuevo: string) => { },
  cambiar_mail: (mail_nuevo: string) => { },
  cambiar_password: (password_nuevo: string) => { },
  login_app: (user: User) => {},
  logout: () => { },
  actualizar_info: (id:number)=>{}
});

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [id,setId] = useState(0);
  const [saldo,setSaldo] = useState(0);
  const [nombre, setNombre] = useState("Ejemplo");
  const [mail, setMail] = useState("an@example.com");
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  const cambiarNombre = async (nombre_nuevo: string) => {
    try {
        
        const rsp=await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/edit_profile/${id}`,
            {method: "PATCH",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({new_name:nombre_nuevo})
            }
        )
        if (!rsp.ok){
          throw new Error
        }
    } catch (e){
        console.log(e)
    }
  }

  const cambiar_mail = async (mail_nuevo: string) => {
    try {
      const rsp=await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/edit_profile/${id}`,
          {method: "PATCH",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({new_mail:mail_nuevo})
          }
      )
      if (!rsp.ok){
        if (rsp.status==409) alert("Ya existe un usuario con ese mail")
        throw new Error
      }
    } catch (e){
        console.log(e)
    }
  }

  const cambiar_password = async (password_nuevo: string) => {
    try {
        const rsp=await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/edit_profile/${id}`,
            {method: "PATCH",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({new_password:password_nuevo})
            }
        )
        if (!rsp.ok){
          throw new Error
        }
    } catch (e){
        console.log(e)
    }
  }

  const login_app = async (user:User) => {
    setId(user.id);
    setMail(user.mail);
    setNombre(user.name);
    setSaldo(user.saldo);
    setIsLoggedIn(true);
    try {
      await  AsyncStorage.setItem("token",String(user.id));
    } catch (error) {
      console.log(error,"al guardar la sesión");
    }
  }

  const logout = async () => {
    setIsLoggedIn(false);
    setId(0);
    setMail("");
    setNombre("");
    setSaldo(0);
    try {
      await  AsyncStorage.removeItem("token");
    } catch (error) {
      console.log(error,"al cerrar la sesión");
    }
  }
  const actualizar_info = async (id:number) =>{ //después de editar el perfil o agregar gastos e ingresos
    try {
      const rsp = await  fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/${id}`,{
              method:"GET",
              headers:{"Content-Type":"application/json"},
              })
      if (!rsp.ok){
          throw new Error(rsp.statusText)
      } else {
          const datos_usuario: User = await rsp.json();
          setMail(datos_usuario.mail);
          setNombre(datos_usuario.name);
          setSaldo(datos_usuario.saldo);
        }
  }catch(e){
    console.log(e);
  }}
  return (
      <UserContext.Provider value={{nombre,mail, id,isLoggedIn, saldo , cambiarNombre,
                                  login_app, logout, cambiar_mail,cambiar_password,actualizar_info}}>
          {children}
      </UserContext.Provider>
  );
}

export const useUserContext = () => {
    return useContext(UserContext);
}
    