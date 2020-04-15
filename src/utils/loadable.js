import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';

export default (loader) => Loadable({
    loader,
    loading: () => <Loading />
});
