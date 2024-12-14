type User = {id: number,mail:string,name:string,password:string,saldo:number}
type Category ={id :number, name: string,description: string}
type Gasto ={ id: number, monto: number, cant_cuotas:number, fecha: Date, category: Category}
type Ingreso = {id:number,monto: number,description: string,fecha:Date,category: Category}
type Presupuesto ={id: number, descripcion: string,montoTotal: number, fecha_objetivo: Date}

export type {Category,Ingreso,Gasto,Presupuesto,User};

