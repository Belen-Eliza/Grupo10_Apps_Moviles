import { createContext, useContext, useState } from "react";
import { router } from "expo-router";
type User = {id: number,mail:string,name:string,password:string,saldo:number}



export const UserContext = createContext({
  nombre: "Ej",
  id: 1,
  mail: "mail",
  isLoggedIn: false,
  saldo: 1,
  cambiarNombre: (nombre_nuevo: string) => { },
  cambiar_mail: (mail_nuevo: string) => { },
  cambiar_password: (password_nuevo: string) => { },
  login_app: (user: User) => { console.log("esta")},
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
        const nuevo_user ={id:id,name:nombre_nuevo}
        const rsp=await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/edit_profile`,
            {method: "PATCH",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(nuevo_user)
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
        const nuevo_user ={id:id,mail:mail_nuevo}
        const rsp=await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/edit_profile`,
            {method: "PATCH",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(nuevo_user)
            }
        )
        if (!rsp.ok){
          throw new Error
        }
    } catch (e){
        console.log(e)
    }
  }

  const cambiar_password = async (password_nuevo: string) => {
    try {
        const nuevo_user ={id:id,password:password_nuevo}
        const rsp=await fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/users/edit_profile`,
            {method: "PATCH",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(nuevo_user)
            }
        )
        if (!rsp.ok){
          throw new Error
        }
    } catch (e){
        console.log(e)
    }
  }

  const login_app = (user:User) => {
    setId(user.id);
    setMail(user.mail);
    setNombre(user.name);
    setSaldo(user.saldo);
    setIsLoggedIn(true);
  }

  const logout = () => {
      setIsLoggedIn(false);
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
          console.log(datos_usuario)
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
    