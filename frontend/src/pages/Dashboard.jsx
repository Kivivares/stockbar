import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../components/Spinner";
import {getDrinks, reset} from "../features/drinks/drinkSlice";

function Dashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user} = useSelector((state) => state.auth)
    const {drinks, isLoading, isError, message} = useSelector((state) => state.drinks)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        dispatch(getDrinks())

        return () => {
            dispatch(reset())
        }
    }, [user, navigate, isError, message, dispatch])

    if (isLoading) {
        return <Spinner/>
    }
    return user && (
        <>
            <section className={'heading'}>
                <h1>Welcome {user && user.name}</h1>
            </section>
        </>
    )
}

export default Dashboard