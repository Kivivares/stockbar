import {Link, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {logout, reset} from "../features/auth/authSlice";

function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }

    return (
        <>
            <div className="mx-auto px-4">
                <div className="flex flex-wrap items-center h-24 justify-between font-mono uppercase">
                    {user ?
                        <>
                            <div>
                                <Link to={'/'}><span className={'text-4xl inline align-middle'}> Our Company <span
                                    className={'text-2xl align-middle inline-block'}>X</span> You
                        </span></Link>
                            </div>
                        </> : <></>}
                </div>
            </div>
        </>
    )
}

export default Header