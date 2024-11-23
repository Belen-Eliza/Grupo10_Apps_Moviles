

const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return {msj:'La contraseña debe tener al menos 8 caracteres y un carácter especial',status:false}
    } else {
        return {msj:"",status:true}
    }
};


const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {msj:'El formato del email no es válido',status:false}
    } else {
        return {msj:"",status:true}
    }
};
export {validatePassword, validateEmail}