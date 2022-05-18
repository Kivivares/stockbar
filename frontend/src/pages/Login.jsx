import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom'
import {toast} from "react-toastify";
import {login, reset} from "../features/auth/authSlice";
import Spinner from "../components/Spinner";

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const {email, password} = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user, isLoading, isError, isSuccess, message} = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            navigate('/stonks')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    if (isLoading) {
        return <Spinner/>
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email, password
        }

        dispatch(login(userData))
    }

    return !user && (
        <div className="flex max-w-full justify-center">
            <div className="md:basis-1/3 ">
                <form onSubmit={onSubmit}>
                    <div className="mx-auto flex items-center pt-4 text-gray-500 flex-col">
                        <h1 className="text-white text-2xl">Login</h1>

                        <input
                            className="text-white w-full mt-2 p-2 bg-stone-800 rounded-md  border border-stone-700 focus:outline-none focus:ring-2 focus:ring-white"
                            type={'text'}
                            id={'email'}
                            name={'email'}
                            value={email}
                            placeholder={'Enter your email'}
                            onChange={onChange}
                        />

                        <input
                            className="text-white w-full mt-2 p-2 bg-stone-800 rounded-md  border border-stone-700 focus:outline-none focus:ring-2 focus:ring-white"
                            type={'password'}
                            id={'password'}
                            name={'password'}
                            value={password}
                            placeholder={'Enter your password'}
                            onChange={onChange}
                        />

                        <button
                            className="w-11/12 mt-2 p-2 bg-gray-50 rounded-full font-bold text-gray-900 border border-gray-700"
                            type={'submit'}>Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login