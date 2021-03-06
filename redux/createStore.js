import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import { loadingBarMiddleware } from 'react-redux-loading-bar'

/**
 * 创建store
 * @param rootReducer
 * @param rootSaga
 * @returns {*}
 */

export default function (rootReducer, rootSaga) {
    const middleware = [];
    const enhancers = [];

    // saga中间件
    const sagaMiddleware = createSagaMiddleware();
    middleware.push(sagaMiddleware);

    // log中间件
    const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED'];
    if (process.env.NODE_ENV !== 'production') {
        const logger = createLogger({
            predicate: (getState, { type }) => SAGA_LOGGING_BLACKLIST.indexOf(type) === -1
        });
        middleware.push(logger);
    }

    middleware.push(loadingBarMiddleware());

    //middleware.push(routerMiddleware(history));

    middleware.push(thunkMiddleware);

    // 合并中间件
    enhancers.push(applyMiddleware(...middleware));

    // persist rehydrate
    enhancers.push(autoRehydrate());

    const store = createStore(rootReducer, compose(...enhancers));

    // kick off root saga
    sagaMiddleware.run(rootSaga);

    return store;
}
