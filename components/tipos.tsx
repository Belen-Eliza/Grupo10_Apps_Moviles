import { MaterialIcons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { Pressable, Text, TouchableOpacity } from "react-native"
import { estilos } from "./global_styles"

type User = {id: number,mail:string,name:string,password:string,saldo:number}
type Category ={id :number, name: string}
type Gasto ={ id: number, monto: number,description: string, fecha: Date, category: Category}
type Ingreso = {id:number,monto: number,description: string,fecha:Date,category: Category}
type Presupuesto ={id: number, descripcion: string,montoTotal: number, fecha_objetivo: Date}

interface ActionButtonProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    href: string;
}
const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, href }) => (
    <Link href={href} asChild>
      <TouchableOpacity style={estilos.actionButton} >
        <MaterialIcons name={icon} size={24} color="#FFFFFF" />
        <Text style={estilos.actionButtonText}>{label}</Text>
      </TouchableOpacity>
    </Link>
  );

export type {Category,Ingreso,Gasto,Presupuesto,User,ActionButtonProps, };
export {ActionButton, }

