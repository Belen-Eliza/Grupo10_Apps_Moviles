import Toast from 'react-native-root-toast'

function success_alert(msg:string){
    Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "green",
        textColor: "white",
        opacity: 1,
    });

}

function error_alert(msg:string){
    Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "red",
        textColor: "white",
        opacity: 1,
    });
}

export  {success_alert, error_alert }