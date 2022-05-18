import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createDrink, deleteDrink, editDrink, getDrinks, reset} from "../features/drinks/drinkSlice";
import {toast} from "react-toastify";

function Drinks() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user} = useSelector((state) => state.auth)
    const {drinks, isLoading, isError, message} = useSelector((state) => state.drinks)

    const initialNewState = {
        name: '',
        category: '',
        basePrice: 0,
        maxPrice: 0,
        minPrice: 0,
    }

    const initialEditState = {
        _id: null,
        name: '',
        category: '',
        basePrice: 0,
        maxPrice: 0,
        minPrice: 0,
    }

    const [newFormData, setNewFormData] = useState(initialNewState)
    const {
        name: newName,
        category: newCategory,
        basePrice: newBasePrice,
        maxPrice: newMaxPrice,
        minPrice: newMinPrice
    } = newFormData

    const [editFormData, setEditFormData] = useState(initialEditState)
    const {
        _id: editId,
        name: editName,
        category: editCategory,
        basePrice: editBasePrice,
        maxPrice: editMaxPrice,
        minPrice: editMinPrice
    } = editFormData

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }

        if (isError) {
            toast.error(message)
        }

        dispatch(getDrinks())

        return () => {
            dispatch(reset())
        }
    }, [user, navigate, isError, message, dispatch])

    const onChangeNew = (e) => {
        setNewFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmitNew = (e) => {
        e.preventDefault()

        dispatch(createDrink(newFormData))
        setNewFormData(initialNewState)
        onCancelEdit()
    }

    const onDelete = (drink) => {
        dispatch(deleteDrink(drink._id))
        onCancelEdit()
    }

    const onEdit = (drink) => {
        setEditFormData(drink)
    }

    const onCancelEdit = () => {
        setEditFormData(initialEditState)
    }

    const onChangeEdit = (e) => {
        setEditFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmitEdit = (e) => {
        e.preventDefault()
        dispatch(editDrink(editFormData))
        setEditFormData(initialEditState)
    }

    return (
        <div>
            <div className={'grid grid-cols-6'}>
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
                    className={'bg-neutral-700 text-white py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase'}>Min
                    price
                </div>
                <div
                    className={'bg-neutral-700 text-white py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase'}>Max
                    price
                </div>
                <div
                    className={'bg-neutral-700 text-white py-3 px-2 md:px-8 text-xs font-medium tracking-wider text-left uppercase'}></div>
                {drinks.map((drink) => (
                    drink._id !== editId ? <>
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
                                className={'border-b border-neutral-700 pt-3 px-2 md:px-8 text-sm text-neutral-400 whitespace-nowrap'}>
                                {drink.minPrice}
                            </div>
                            <div
                                className={'border-b border-neutral-700 pt-3 px-2 md:px-8 text-sm text-neutral-400 whitespace-nowrap'}>
                                {drink.maxPrice}
                            </div>
                            <div
                                className={'grid grid-cols-2 border-b border-neutral-700 pt-1 pb-1 px-2 md:px-8 text-sm text-neutral-400 whitespace-nowrap'}>
                                <button type={'button'} onClick={() => {
                                    if (window.confirm('Are you sure you wish to delete this item?')) onDelete(drink)
                                }}
                                        className="text-red-700 hover:bg-gray-700 hover:text-red-500 p-2 rounded-md">Delete
                                </button>
                                <button onClick={() => {
                                    onEdit(drink)
                                }}>
                                    <div className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded-md">Edit
                                    </div>
                                </button>
                            </div>
                        </> :
                        <form onSubmit={onSubmitEdit} className={'grid grid-cols-6 col-span-6'}>
                            <div
                                className="bg-neutral-800 border-b border-neutral-700 pt-3 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                <input type={'text'}
                                       name={'name'}
                                       id={'editName'}
                                       value={editName}
                                       onChange={onChangeEdit}
                                       className={'text-white focus:outline-none bg-transparent border-b border-dotted border-neutral-700 focus:border-white'}
                                />
                            </div>
                            <div
                                className={'bg-neutral-800 border-b border-neutral-700 pt-3 px-2 md:px-8 text-sm text-neutral-400'}>
                                <input type={'text'}
                                       name={'category'}
                                       id={'editCategory'}
                                       value={editCategory}
                                       onChange={onChangeEdit}
                                       className={'text-white focus:outline-none bg-transparent border-b border-dotted border-neutral-700 focus:border-white'}
                                />
                            </div>
                            <div
                                className={'bg-neutral-800 border-b border-neutral-700 pt-3 px-2 md:px-8 text-sm text-neutral-400'}>
                                <input type={'number'}
                                       step={"0.01"}
                                       name={'basePrice'}
                                       id={'editBasePrice'}
                                       value={editBasePrice}
                                       onChange={onChangeEdit}
                                       className={'text-white focus:outline-none bg-transparent border-b border-dotted border-neutral-700 focus:border-white'}
                                />
                            </div>
                            <div
                                className={'bg-neutral-800 border-b border-neutral-700 pt-3 px-2 md:px-8 text-sm text-neutral-400'}>
                                <input type={'number'}
                                       step={"0.01"}
                                       name={'minPrice'}
                                       id={'editMinPrice'}
                                       value={editMinPrice}
                                       onChange={onChangeEdit}
                                       className={'text-white focus:outline-none bg-transparent border-b border-dotted border-neutral-700 focus:border-white'}
                                />
                            </div>
                            <div
                                className={'bg-neutral-800 border-b border-neutral-700 pt-3 px-2 md:px-8 text-sm text-neutral-400'}>
                                <input type={'number'}
                                       step={"0.01"}
                                       name={'maxPrice'}
                                       id={'editMaxPrice'}
                                       value={editMaxPrice}
                                       onChange={onChangeEdit}
                                       className={'text-white focus:outline-none bg-transparent border-b border-dotted border-neutral-700 focus:border-white'}
                                />
                            </div>
                            <div
                                className={'bg-neutral-800 border-b border-neutral-700 grid grid-cols-2 border-b border-neutral-700 pt-1 pb-1 px-2 md:px-8 text-sm text-neutral-400 whitespace-nowrap'}>
                                <button onClick={() => {
                                    onCancelEdit()
                                }}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded-md">Cancel
                                </button>
                                <button>
                                    <div
                                        className="text-green-700 hover:bg-neutral-700 hover:text-green-600 p-2 rounded-md">Save
                                    </div>
                                </button>
                            </div>
                        </form>
                ))}
                <form onSubmit={onSubmitNew} className={'grid grid-cols-6 col-span-6 border-t'}>
                    <div className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <input type={'text'}
                               name={'name'}
                               id={'name'}
                               value={newName}
                               onChange={onChangeNew}
                               className={'text-white focus:outline-none bg-transparent border-b border-dotted border-neutral-700 focus:border-white'}
                        />
                    </div>
                    <div className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <input type={'text'}
                               name={'category'}
                               id={'category'}
                               value={newCategory}
                               onChange={onChangeNew}
                               className={'text-white focus:outline-none bg-transparent border-b border-dotted border-neutral-700 focus:border-white'}
                        />
                    </div>
                    <div className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <input type={'number'}
                               step={"0.01"}
                               name={'basePrice'}
                               id={'basePrice'}
                               value={newBasePrice}
                               onChange={onChangeNew}
                               className={'text-white focus:outline-none bg-transparent border-b border-dotted border-neutral-700 focus:border-white'}
                        />
                    </div>
                    <div className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <input type={'number'}
                               step={"0.01"}
                               name={'minPrice'}
                               id={'minPrice'}
                               value={newMinPrice}
                               onChange={onChangeNew}
                               className={'text-white focus:outline-none bg-transparent border-b border-dotted border-neutral-700 focus:border-white'}
                        />
                    </div>
                    <div className="py-4 px-2 md:px-8 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                        <input type={'number'}
                               step={"0.01"}
                               name={'maxPrice'}
                               id={'maxPrice'}
                               value={newMaxPrice}
                               onChange={onChangeNew}
                               className={'text-white focus:outline-none bg-transparent border-b border-dotted border-neutral-700 focus:border-white'}
                        />
                    </div>
                    <div
                        className={'md:px-8 text-center pt-1 pb-1 px-2 md:px-8 text-sm text-neutral-400 whitespace-nowrap'}>
                        <button className="text-green-700 hover:bg-neutral-700 hover:text-green-600 p-2 rounded-md">Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Drinks