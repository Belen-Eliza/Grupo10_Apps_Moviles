const today = () => {
    let fecha = new Date();
    fecha.setHours(23, 59);
    return fecha;
};

const semana_pasada = ()=>{
    let fecha = new Date();
    fecha.setTime(fecha.getTime()-7*24*60*60*1000);
    return fecha
};

const mes_pasado = ()=>{
    let fecha = new Date();
    return mes_anterior(fecha)
}

const year_start = ()=>{
    let fecha = new Date();
    fecha.setMonth(0);
    fecha.setDate(1);
    fecha.setHours(0,0,0,0);
    return fecha
}

const mes_anterior = (f: Date)=>{
    f.setMonth(f.getMonth()-1)
    return f
}
const mes_siguiente = (f: Date)=>{
    if (!(f.getMonth()==today().getMonth() && f.getFullYear()==today().getFullYear())){
        f.setMonth(f.getMonth()+1);
    }
    return f
}
const meses = ["Ene","Feb","Mar","Abr","Mayo","Jun","Jul","Ago","Sept","Oct","Nov","Dic"];

export {today,semana_pasada,mes_pasado,year_start,mes_anterior,meses,mes_siguiente}