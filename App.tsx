import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Login from './views/Login';
import CrearCuenta from './views/CrearCuenta';
import Proyectos from './views/Proyectos';
import NuevoProyecto from './views/NuevoProyecto';
import Proyecto from './views/Proyecto';

const Stack = createNativeStackNavigator()

const App =() => {

  return (
    <>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login'>

            <Stack.Screen 
              name="Login" 
              component={Login}
              options={{
                title: 'Iniciar Sesión',
                headerShown: false 
              }}
            />

            <Stack.Screen 
              name="CrearCuenta" 
              component={CrearCuenta}
              options={{
                title: 'Crear Cuenta',
                headerShown: false 
              }} 
            />

            <Stack.Screen 
              name="Proyectos" 
              component={Proyectos}
              options={{
                title: 'Proyectos',
                headerTintColor: 'white',
                headerTitleAlign: 'center',
                headerTitleStyle:{
                  fontWeight: 'bold',
                  fontSize: 22
                },
                headerStyle: {
                  backgroundColor:'#e84347'
                },
                headerShown: true,
              }}
            />

            <Stack.Screen 
              name="NuevoProyecto" 
              component={NuevoProyecto}
              options={{
                title: 'Nuevo Proyecto',
                headerTintColor: 'white',
                headerTitleAlign: 'center',
                headerTitleStyle:{
                  fontWeight: 'bold',
                  fontSize: 22
                },
                headerStyle: {
                  backgroundColor:'#e84347'
                },
                headerShown: true,
              }}
            />

            <Stack.Screen 
              name="Proyecto" 
              component={Proyecto}
              options={ ({route}) => ({
                title: route.params.nombre,
                headerTintColor: 'white',
                headerTitleAlign: 'center',
                headerTitleStyle:{
                  fontWeight: 'bold',
                  fontSize: 22
                },
                headerStyle: {
                  backgroundColor:'#e84347'
                },
                headerShown: true,
              })}
            />

          </Stack.Navigator>
        </NavigationContainer>
    </>
  );
}

export default App;
