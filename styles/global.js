import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    contenedor: {
        flex: 1,

    },

    contenido:{
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: '3%',
        flex:1,
    },

    titulo: {
        textAlign:'center',
        marginBottom: 20,
        fontSize: 32, 
        fontWeight: 'bold',
        color: 'white',
        paddingTop:20

    },

    subtitulo:{
        textAlign:'center',
        marginBottom: 20,
        fontSize: 26, 
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },

    input: {
        backgroundColor: 'white',
        marginBottom: 20
    },

    boton:{
        backgroundColor: '#28303B',
    },

    botonTexto:{
        color: 'white',
        textAlign: 'center',
        textTransform: 'uppercase'
    },

    enlace:{
        color: 'white',
        marginTop: 50,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
})

export default globalStyles