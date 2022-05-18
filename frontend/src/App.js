import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Stonks from "./pages/Stonks";

function App() {
    return (
        <div className={'h-full min-h-screen min-w-full bg-gradient-to-b from-neutral-900 to-zinc-900 text-white'}>
            <Router>
                <div className="pt-16 flex justify-center flex-nowrap">
                    {/* Replace with your content */}
                    <div className={'basis-11/12 overflow-x-auto'}>
                        <Header/>
                        <Routes>
                            <Route path='/' element={<Dashboard/>}/>
                            <Route path='/login' element={<Login/>}/>
                            <Route path='/stonks' element={<Stonks/>}/>
                        </Routes>
                    </div>
                    {/* /End replace */}
                </div>
            </Router>
            <ToastContainer/>
            <div className={'h-16'}>

            </div>
        </div>
    );
}

export default App;
