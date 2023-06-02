import React from 'react'
import { View , Text, ToastAndroid, StyleSheet, Alert } from 'react-native'
import { NativeBaseProvider, Input, FormControl, Button, List} from 'native-base'
import globalStyles from '../styles/global'
import Icon from 'react-native-vector-icons/Ionicons'
import {gql, useMutation} from '@apollo/client'

const ACTUALIZAR_TAREA = gql`
    mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean ){
        actualizarTarea(id: $id, input: $input, estado: $estado){
            nombre
            id
            proyecto
            estado
        }
    }
`

const ELIMINAR_TAREA = gql`
    mutation eliminarTarea($id: ID!){
        eliminarTarea(id: $id)
    }
`
const OBTENER_TAREAS = gql`
    query obtenerTareas( $input: ProyectoIDInput ) {
        obtenerTareas(input: $input) {
            nombre
            id
            estado
        }
    }
`

//********************************************************************* */
const Tarea = ( {tarea, proyectoId} ) => {

  //Apollo
  const [ actualizarTarea ] = useMutation( ACTUALIZAR_TAREA )
  const [ eliminarTarea ] = useMutation( ELIMINAR_TAREA,{ 
    update(cache, {data: {eliminarTarea}}){
        const { obtenerTareas } = cache.readQuery({
            query: OBTENER_TAREAS,
            variables: { input: { proyectoId } }
        })

        cache.writeQuery({
            query: OBTENER_TAREAS,
            variables: { input: { proyectoId } },
            data: { obtenerTareas: obtenerTareas.filter( tareaActual => tareaActual.id !== tarea.id )}
        })
    }
  })


  //Cambiar estado a true o false -- Tengo error aca!
  const cambiarEstado = async () => {
    const { id } = tarea
    // console.log(!tarea.estado)
    try {
        const { data } = await actualizarTarea({
            variables: {
                id,
                input: {
                    nombre: tarea.nombre
                },
                estado: !tarea.estado
            }
        })

        console.log(data)
    } catch (error) {
        console.log(error)
    }
  }

  //Genera una Alerta
  const mostrarEliminar = () => {
    Alert.alert(
        'Eliminar Tarea',
        '¿Deseas eliminar esta tarea?',[
            {
                text:  'Cancelar',
                style: 'cancel' 
            },
            {
                text: 'Ok',
                onPress: () => eliminarTareaDB()
            }
    ])
  }

  //Se elimina de DB
  const eliminarTareaDB = async () => {
    const { id } = tarea
    try {
        const { data } = await eliminarTarea({
            variables: {
                id
            }
        })

        console.log(data)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    // <List.Item style={styles.contenido}>
        <View 
            style={styles.contenido}
        >
            <Text style={styles.texto}>{tarea.nombre}</Text>

            <Icon
                name='trash-outline'
                size={36}
                color='#f00'
                onTouchStart={ () => mostrarEliminar()}
            />

            { tarea.estado ? 
                <Icon
                    name='checkmark-circle-sharp'
                    style={[styles.icono, styles.completo]}
                    size={36}
                    onTouchStart={ () => cambiarEstado()}
                />            
                : 
                <Icon
                    name='checkmark-circle-sharp'
                    style={[styles.icono, styles.incompleto]}
                    size={36}
                    onTouchStart={ () => cambiarEstado()}
                /> 
            }
        </View>
    // </List.Item>
  )
}

const styles = StyleSheet.create({
    contenido: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding:10
    },
  
    texto:{
      color: 'black',
      marginLeft:10,
      paddingVertical: 10,
      width: '60%'
    },
    
    icono:{
        marginRight:10
    },

    completo:{
        color: 'green',
    },

    incompleto:{
        color: '#E1E1E1'
    }
  })



export default Tarea