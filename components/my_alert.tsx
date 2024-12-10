import Toast from 'react-native-root-toast'

function my_alert(msg:string){
    Toast.show("Complete todos los campos para continuar", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
    });
}

export default my_alert