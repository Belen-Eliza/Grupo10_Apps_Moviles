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
    fecha.setMonth(fecha.getMonth()-1);
    return fecha
}

const year_start = ()=>{
    let fecha = new Date();
    fecha.setMonth(0);
    fecha.setDate(1);
    fecha.setHours(0,0,0,0);
    return fecha
}

export {today,semana_pasada,mes_pasado,year_start}