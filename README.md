# React-Redux-Tutorial

리액트에 리덕스 적용시켜보고 정리한 내용입니다.

## 구조 만들기

ducks구조는 modules를 만들고 각각의 리두서를 만들고, modules/index.js에서 합치는 구조입니다. 해당 튜토리얼에는 counter와 todos의 리듀서가 있고, index.js에서 combineReducers를 통해서 합쳐집니다.

## 액션 정의하기

```js
const INCREASE = "counter/INCREASE";
```

해당 형태로 액션을 정의할 수 있습니다.  
"리듀서이름/액션"형태로 정의하면 액션이 중복되더라도 상관없이 작성할 수 있습니다.

## 액션 생성 함수

액션 생성 함수는 액션에 대해서 리턴해야할 객체를 만들어주는 함수입니다.

```js
export const increase = () => ({ type: INCREASE });
```

위와같이 정의할 수 있습니다.

만약에 매개변수가 필요하다면 아래와 같이 정의하면 됩니다.

```js
export const changeInput = input => ({
  type: CHANGE_INPUT,
  input
});
```

## createAction으로 액션 생성 함수 만들기

```js
import { createAction } from "redux-actions";

//매개변수가 없을때
export const increase = createAction(INCREASE);

//매개변수가 필요할 때
export const changeInput = createAction(CHANGE_INPUT, input => input);
```

위와 같이 createAction을 통해서 쉽게 액션생성함수를 만들 수 있습니다.

## 초기 state 정의하기

```js
const initialState = {
  number: 0
};
```

액션과 액션 생성 함수를 만들었으면 초기의 state를 정의하고 리듀서에 전달해줍니다.

## 기본적인 리듀서의 형태

```js
function counter(state = initialState, action) {
  switch (action.type) {
    case INCREASE:
      return {
        number: state.number + 1
      };
    default:
      return state;
  }
}
```

위와 같이 switch문을 통해서 action의 타입을 비교해 state를 바꿔줍니다.

## handleActions를 이용한다면?

```js
import { handleActions } from "redux-actions";

const counter = handleActions(
  {
    [INCREASE]: (state, action) => ({ number: state.number + 1 })
  },
  initialState
);
```

handleActions를 이용하면 type말고 다른 값은 payload라는 객체를 통해서 받아옵니다. 그래서 값을 활용하실땐 payload 객체를 이용하셔야 합니다.

## combineReducers를 이용해 리듀서 합치기

```js
// modules/index.js

import { combineReducers } from "redux";
import counter from "./counter";

const rootReducer = combineReducers({
  counter,
  다른리듀서들
});
```

위와 같이 리듀서를 합치면 rootReducer가 state가 됩니다. 즉 state.counter를 통해서 counter의 값에 접근할 수 있습니다.

## 프로젝트에 리덕스 연결시키기

```js
// index.js
import { createStore } from "redux";
import { Provider } from "react-redux";

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

createStore에 리듀서를 전달하면 store가 생성됩니다. 해당 store를 Provider에 전달하고 App 컴포넌트를 감싸주면 됩니다.

## 컴포넌트에서 사용하기

```js
// 컴포넌트와 리덕스를 연결할 connect 불러오기
import { connect } from "react-redux";
//액션 생성함수 불러오기
import { increase } from "../modules/counter";

const CounterContainer = ({ number, increase }) => {
  return <Counter number={number} onIncrease={increase} />;
};

// state를 props에 맵핑 시킴
const mapStateToProps = state => ({
  number: state.counter.number
});

// dispatch를 props에 맵핑 시킴
const mapDispatchToProps = dispatch => ({
  increase: () => dispatch(increase())
});

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);
```

connect함수에 mapStateToProps와 mapDispatchToProps을 전달해서 리턴되는 함수에 컴포넌트를 인자로 넣은 형태가 되면 컴포넌트에서 사용이 가능하다.

## useSelector, useDispatch, useCallback, React.memo를 통해서 구현하기

```js
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { increase } from "../modules/counter";

const CounterContainer = () => {
  const number = useSelector(state => state.counter.number);
  const dispatch = useDispatch();
  const onIncrease = useCallback(() => dispatch(increase()), [dispatch]);
  return <Counter number={number} onIncrease={onIncrease} />;
};

export default React.memo(CounterContainer);
```

useSelector 훅은 state를 불러오고, useDispatch 훅은 디스패치를 불러옵니다. export 할땐 React.memo에 감싸주면 됩니다.

## connect의 장점

connect를 사용해서 만들었을 땐 해당 컴포넌트의 부모 컴포넌트가 리렌더링 될 때, 해당 컨테이너의 props가 바뀌지 않았다면 리렌더링이 자동으로 방지 됩니다. 위에 훅들을 이용해서 만들었을 땐 React.memo를 통해서 방지했습니다.
