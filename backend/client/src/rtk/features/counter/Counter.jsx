import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment, reset } from './counterSlice';

const Counter = () => {
    const dispatch = useDispatch();
    const count = useSelector((state) => state.counter.value);

    return (
        <div className="counter">
            <h1>Counter: {count}</h1>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
            <button onClick={() => dispatch(reset())}>Reset</button>
        </div>
    );
};

export default Counter;
