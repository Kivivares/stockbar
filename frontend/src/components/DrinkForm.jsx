import {useState} from "react";
import {useDispatch} from "react-redux";
import {createDrink} from '../features/drinks/drinkSlice'

function DrinkForm() {
    const [name, setText] = useState('')

    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault()

        dispatch(createDrink({name}))
        setText('')
    }

    return (
        <section className={'.bg-amber-600'}>
            <form onSubmit={onSubmit}>
                <div className={'form-group'}>
                    <label htmlFor={name}>Drink</label>
                    <input type={'name'}
                           name={'name'}
                           id={'name'}
                           value={name}
                           onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className={'form-group'}>
                    <button className={'btn btn-block'} type={'submit'}>
                        Add drink
                    </button>
                </div>
            </form>
        </section>
    )
}

export default DrinkForm