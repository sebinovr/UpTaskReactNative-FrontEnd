import React, {useState} from 'react'
import { View , Text, ToastAndroid, StyleSheet } from 'react-native'
import { NativeBaseProvider, Input, FormControl, Button, List} from 'native-base'
import globalStyles from '../styles/global'
import { gql, useMutation, useQuery } from '@apollo/client'
import Tarea from '../components/Tarea'

const NUEVA_TAREA = gql`
    mutation nuevaTarea( $input: TareaInput) {
        nuevaTarea(input: $input) {
            nombre
            id
            proyecto
            estado
        }
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

const Proyecto = ({route}) => {

  //console.log(route.params)
  //ID del proyecto
  const { id } = route.params

  //State
  const [nombre, guardarNombre] = useState('')
  const [mensaje, guardarMensaje] = useState('') 
  
  //Apollo - Obtener Tareas
  const { data, loading, error } = useQuery(OBTENER_TAREAS,{
    variables: { input: { proyecto: id } }
  })

//   console.log(data)

  //Apollo - Crear Tarea
  const [ nuevaTarea ] =useMutation(NUEVA_TAREA,{
    update(cache, { data: {nuevaTarea}}){
        const { obtenerTareas } = cache.readQuery({
            query: OBTENER_TAREAS,
            variables: { input: {proyecto: id} }
        })

        cache.writeQuery({
            query: OBTENER_TAREAS,
            variables: { input: {proyecto: id} },
            data: { obtenerTareas: [...obtenerTareas, nuevaTarea] }
        })
    }
  })

  //HandleSubmit
  const handleSubmit = async () => {
    if (nombre==='') {
        guardarMensaje('Todos los campos son obligatorios.')
        return
    }

    //Guardar en BD
    try {
        const { data } = await nuevaTarea({
            variables: {
                input:{
                    nombre,
                    proyecto: id
                }
            }
        })

        // console.log(data)
        guardarNombre('')
        guardarMensaje('Tarea Creada Correctamente.')

    } catch (error) {
        console.log(error.message)
    }
    guardarMensaje('')
  }

  //Toast
  const mostrarAlerta = () => {
    ToastAndroid.showWithGravityAndOffset(
      mensaje,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      30,
      50,
    )
    guardarMensaje('')
  }

  if(loading) return <Text>Cargando...</Text>

  return (
    <NativeBaseProvider>
        <View style={[globalStyles.contenedor, { backgroundColor: '#e84347'} ]}>

            <FormControl style={[ styles.formulario ,{ marginTop:20 } ]} >
                <View style={globalStyles.input}>
                    <Input 
                        placeholder='Nombre de Tarea'
                        placeholderTextColor='#999'
                        w='100%'
                        value={nombre}
                        onChangeText={(text) => guardarNombre(text)}
                    />
                </View>

                <Button 
                    style={globalStyles.boton}
                    onPress={() => handleSubmit()}
                >
                    <Text style={globalStyles.botonTexto}>Crear Tarea</Text>
                </Button>
            </FormControl> 
            
            <Text style={globalStyles.subtitulo}>Tareas: {route.params.nombre}</Text>
            
            <View>
              <List style={styles.contenido}>
                {data.obtenerTareas.map( tarea => (
                    <Tarea
                        key={tarea.id}
                        tarea={tarea}
                        proyectoId={id}
                    />
                ))}
              </List>
            </View>



            { mensaje ? mostrarAlerta() : "" }

        </View>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
    formulario:{
        paddingHorizontal: 20
    },

    contenido: {
        backgroundColor: '#FFF',
        marginHorizontal: '3%',
    },
    
    texto:{
        color: 'black',
        paddingVertical: 5
    }
})

export default Proyecto