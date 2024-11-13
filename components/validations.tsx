

const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return 'La contraseña debe tener al menos 8 caracteres y un carácter especial'
    } else {
        return ""
    }
};


const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'El formato del email no es válido'
    } else {
        return ""
    }
};
export {validatePassword, validateEmail}