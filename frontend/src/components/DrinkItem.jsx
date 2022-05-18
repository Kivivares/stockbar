import {useDispatch} from "react-redux";
import {deleteDrink} from '../features/drinks/drinkSlice'

function DrinkItem({drink}) {
    const dispatch = useDispatch()
    return (
        <div className={'goal'}>
            <div>
                {new Date(drink.createdAt).toLocaleString('en-EU')}
            </div>
            <h2>{drink.name}</h2>
            <button onClick={() => dispatch(deleteDrink(drink._id))} className={'close'}>
                X
            </button>
        </div>
    )
}

export default DrinkItem