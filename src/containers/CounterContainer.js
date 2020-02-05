import React, { useCallback } from "react";
// import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import Counter from "../components/Counter";
import { increase, decrease } from "../modules/counter";

// const CounterContainer = ({ number, increase, decrease }) => {
//   return (
//     <Counter number={number} onIncrease={increase} onDecrease={decrease} />
//   );
// };

// const mapStateToProps = state => ({
//   number: state.counter.number
// });

// const mapDispatchToProps = {
//   increase,
//   decrease
// };

// export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);

//useSelector를 사용한다면? useDispatch를 사용한다면?
// const CounterContainer = () => {
//   const number = useSelector(state => state.counter.number);
//   const dispatch = useDispatch();
//   return (
//     <Counter
//       number={number}
//       onIncrease={() => dispatch(increase())}
//       onDecrease={() => dispatch(decrease())}
//     />
//   );
// };

//useCallback으로 최적화
const CounterContainer = () => {
  const number = useSelector(state => state.counter.number);
  const dispatch = useDispatch();
  const onIncrease = useCallback(() => dispatch(increase()), [dispatch]);
  const onDecrease = useCallback(() => dispatch(decrease()), [dispatch]);
  return (
    <Counter number={number} onIncrease={onIncrease} onDecrease={onDecrease} />
  );
};

export default CounterContainer;
