import { Outlet } from 'react-router-dom'
import '../styles/AuthLayout.css'


const AuthLayout = () => {
  return (
        <main className="fondo container flex md:flex justify-center pt-2 ">
          <div className='w-full'>
            <Outlet/>
          </div>
        </main>
  )
}

export default AuthLayout