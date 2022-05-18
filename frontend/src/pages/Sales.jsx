import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {reset, saveSingleSale} from "../features/sale/saleSlice";
import {getDrinks} from "../features/drinks/drinkSlice";
import {toast} from "react-toastify";

function Sales() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user} = useSelector((state) => state.auth)
    const {isLoading, isError, isSuccess, message} = useSelector((state) => state.sale)
    const {
        drinks,
        isLoading: isLoadingDrinks,
        isError: isErrorDrinks,
        message: messageDrinks
    } = useSelector((state) => state.drinks)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }

        if (isError) {
            toast.error(message)
        }

        if (isSuccess) {
            toast.success("sold")
        }

        if (drinks.length === 0) {
            dispatch(getDrinks())
        }

        return () => {
            dispatch(reset())
        }
    }, [user, navigate, isError, isSuccess, message, dispatch, drinks])

    const onSingleSale = (drink) => {
        dispatch(saveSingleSale({
            drink: drink._id,
            amount: 1
        }))
    }

    return (
        <div>
            <div className={'grid grid-cols-4'}>
                <div
                    className={'bg-neutral-700 text-white py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase'}>Name
                </div>
                <div
                    className={'bg-neutral-700 text-white py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase'}>Category
                </div>
                <div
                    className={'bg-neutral-700 text-white py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase'}>Base
                    price
                </div>
                <div
                    className={'bg-neutral-700 text-white py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase'}></div>
                {drinks.map((drink) => (
                    <>
                        <div
                            className={'border-b border-neutral-700 pt-3 px-2 md:px-8 text-sm text-neutral-400 whitespace-nowrap'}>
                            {drink.name}
                        </div>
                        <div
                            className={'border-b border-neutral-700 pt-3 px-2 md:px-8 text-sm text-neutral-400 whitespace-nowrap'}>
                            {drink.category}
                        </div>
                        <div
                            className={'border-b border-neutral-700 pt-3 px-2 md:px-8 text-sm text-neutral-400 whitespace-nowrap'}>
                            {drink.basePrice}
                        </div>
                        <div
                            className={'grid grid-cols-2 border-b border-neutral-700 pt-1 pb-1 px-2 md:px-8 text-sm text-neutral-400 whitespace-nowrap'}>
                            <button onClick={() => {
                                onSingleSale(drink)
                            }}>
                                <div className="text-green-700 hover:bg-gray-700 hover:text-green-600 p-2 rounded-md">1+
                                    Sold
                                </div>
                            </button>
                        </div>
                    </>
                ))}
            </div>
        </div>
    )
}

export default Sales