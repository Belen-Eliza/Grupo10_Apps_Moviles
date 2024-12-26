import{estilos} from "@/components/global_styles"
import { useState,useEffect } from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import { Category } from "@/components/tipos";

function CategoryPicker (props:{openPicker:boolean,setOpen:React.Dispatch<React.SetStateAction<boolean>>,selected_cat_id: number,set_cat_id:React.Dispatch<React.SetStateAction<number>>}){
    const [categorias,setCategorias]=useState<Category[]>([{id: 1,name:"Comida",description:""}])

    useEffect(()=>{
        (async ()=>{
          fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/categorias/de_gastos`,{
            method:'GET',
            headers:{"Content-Type":"application/json"}})
          .then(rsp => rsp.json())
          .then(info =>setCategorias(info))
        })();
    
      },[]) 

    return (
        <DropDownPicker style={[{maxWidth:"60%"},estilos.textInput,estilos.margen,estilos.centrado]} open={props.openPicker} 
        value={props.selected_cat_id} items={categorias.map(e=>{return {value:e.id,label:e.name}})} setItems={setCategorias} 
        itemKey="value" setOpen={props.setOpen} setValue={props.set_cat_id} listMode="SCROLLVIEW"/>
    )
}

function CategoryIngresoPicker (props:{openPicker:boolean,setOpen:React.Dispatch<React.SetStateAction<boolean>>,selected_cat_id: number,set_cat_id:React.Dispatch<React.SetStateAction<number>>}){
    const [todas_categorias,setCategorias] =useState<Category[]>([{id:0,name:"",description:""}])

    useEffect(()=>{
        (async ()=>{
        fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/categorias/de_ingresos`,{
            method:'GET',
            headers:{"Content-Type":"application/json"}})
        .then(rsp => rsp.json())
        .then(info =>setCategorias(info))
        })();
    },[]);

    return (
        <DropDownPicker style={[{maxWidth:"60%"},estilos.textInput,estilos.margen,estilos.centrado]} open={props.openPicker} 
          value={props.selected_cat_id} items={todas_categorias.map(e=>{return {value:e.id,label:e.name+" - "+e.description}})} 
          setItems={setCategorias} itemKey="value" setOpen={props.setOpen} setValue={props.set_cat_id}  listMode="SCROLLVIEW"/>
    )
}

function traer_categorias (setCategorias:React.Dispatch<React.SetStateAction<Category[]>>){
  useEffect(()=>{
    (async ()=>{
      fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/categorias/de_gastos`,{
        method:'GET',
        headers:{"Content-Type":"application/json"}})
      .then(rsp => rsp.json())
      .then(info =>setCategorias(info))
      .catch(e=>console.log(e,", en traer categorías de gastos"))
    })();},[])
}
function traer_categorias_ingresos (setCategorias:React.Dispatch<React.SetStateAction<Category[]>>){
  useEffect(()=>{
    (async ()=>{
      fetch(`${process.env.EXPO_PUBLIC_DATABASE_URL}/categorias/de_ingresos`,{
        method:'GET',
        headers:{"Content-Type":"application/json"}})
      .then(rsp => rsp.json())
      .then(info =>setCategorias(info))
      .catch(e=>console.log(e,", en traer categorías de ingresos"))
    })();
  },[])
}

export {CategoryPicker, CategoryIngresoPicker,traer_categorias,traer_categorias_ingresos}
