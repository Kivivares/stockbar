import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import DrinkForm from "../components/DrinkForm"
import DrinkItem from "../components/DrinkItem"
import Spinner from "../components/Spinner";
import {getDrinks, reset} from "../features/drinks/drinkSlice";

function Users() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user} = useSelector((state) => state.auth)
    const {drinks, isLoading, isError, message} = useSelector((state) => state.drinks)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }

        dispatch(getDrinks())

        return () => {
            dispatch(reset())
        }
    }, [user, navigate, isError, message, dispatch])

    if (isLoading) {
        return <Spinner/>
    }
    return (
        <div>
            <table>
                <thead className="bg-stone-700 text-white">
                <tr>
                    <th scope="col"
                        className="py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase">
                        Name
                    </th>
                    <th scope="col"
                        className="py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase">
                        Color
                    </th>
                    <th scope="col"
                        className="py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase">
                        Category
                    </th>
                    <th scope="col"
                        className="py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase">
                        Price
                    </th>
                    <th scope="col" className="relative py-3 md:px-2">
                        <span className="sr-only">Delete</span>
                    </th>
                    <th scope="col" className="relative py-3 md:px-2">
                        <span className="sr-only">Edit</span>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr className="border-b border-stone-700">
                    <td className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        Apple MacBook Pro 17"
                    </td>
                    <td className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        Sliver
                    </td>
                    <td className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        Laptop
                    </td>
                    <td className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        $2999
                    </td>
                    <td className="py-4 md:px-2 text-sm font-medium text-right whitespace-nowrap">
                        <a href="#"
                           className="text-red-700 hover:bg-gray-700 hover:text-red-500 p-2 rounded-md">Delete</a>
                    </td>
                    <td className="py-4 md:px-2 text-sm font-medium text-right whitespace-nowrap">
                        <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded-md">Edit</a>
                    </td>
                </tr>
                <tr className="border-b border-stone-700">
                    <td className="py-4 px-2 md:px-8 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Apple Imac 27"
                    </td>
                    <td className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        White
                    </td>
                    <td className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        Desktop Pc
                    </td>
                    <td className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        $1999
                    </td>
                    <td className="py-4 md:px-2 text-sm font-medium text-right whitespace-nowrap">
                        <a href="#"
                           className="text-red-800 hover:bg-gray-700 hover:text-red-600 p-2 rounded-md">Delete</a>
                    </td>
                    <td className="py-4 md:px-2 text-sm font-medium text-right whitespace-nowrap">
                        <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded-md">Edit</a>
                    </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                    <td className="py-4 px-2 md:px-8 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        Apple Magic Mouse 2
                    </td>
                    <td className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        White
                    </td>
                    <td className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        Accessories
                    </td>
                    <td className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        $99
                    </td>
                    <td className="py-4 px-2 md:px-8 text-sm font-medium text-right whitespace-nowrap">
                        <a href="#" className="text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                </tr>
                </tbody>
            </table>

            <DrinkForm/>

            <section className={'content'}>
                {drinks.length > 0 ? (
                    <div className={'goals'}>
                        {drinks.map((drink) => (
                            <DrinkItem key={drink._id} drink={drink}/>
                        ))}
                    </div>
                ) : (
                    <h3>No drinks</h3>
                )}
            </section>
        </div>
    )
}

export default Users