import immutableTransform from 'redux-persist-transform-immutable';

export default {
    whitelist: ['user'],
    transforms: [immutableTransform()]
}