import matrix from './js/matrix';
import './scss/controls.scss';

//TODO: efectos

var canvas = document.getElementById('canvas');
console.log(canvas);
matrix.setup(canvas);
matrix.reset();
matrix.start();
