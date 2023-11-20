
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import AuthLayout from './layouts/AuthLayout'
import Auth from './pages/Auth'
import RutaProtegida from './layouts/RutaProtegida'
import Register from './pages/Register'
import Pagos from './pages/Pagos'
import RespuestaPago from './pages/RespuestaPago'

import routes from './routes'
import { Suspense } from 'react'
import Loader from './components/Loader'
import ECommerce from './pages/ECommerce'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<AuthLayout />}>
            <Route index element={<Auth />}/>
            <Route path='registrar' element={<Register/>}/>
            <Route path='pagos' element={<Pagos />}/>
            <Route path='resPago' element={<RespuestaPago />}/>
          </Route>

          <Route path='/panel' element={<RutaProtegida />}>
            <Route index element={<ECommerce />}/>
            {routes.map((routes, index) => {
            const { path, component: Component } = routes;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                }
              />
            );
          })}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
